import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { ChatMessage, Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";
import { queryApiService } from "@/services/api/queryApiService";
import { documentService } from "@/services/document/documentService";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import HeroChat from "@/features/chat/components/HeroChat";

interface ChatContainerProps {
  conversationId: string | null;
  sessionId: string | null;
  initialFile?: File | null;
  selectedDocuments?: Array<{ id: string; title: string }>;
  conversations?: Conversation[];
  onOpenDocumentModal?: () => void;
  onRemoveDocument?: (docId: string) => void;
  onCreateConversationFromHeroChat?: (
    conversationId: string,
    initialMessage: string,
    documentIds?: string[]
  ) => void;
  onNewConversation?: (conversation: Conversation) => void;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  conversationId,
  sessionId: propSessionId,
  onNewConversation,
  selectedDocuments = [],
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [searchParams] = useSearchParams();

  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 REF QUAN TRỌNG: Ngăn chặn useEffect load lại dữ liệu khi đang tạo hội thoại mới
  // Giúp tránh việc màn hình bị flash hoặc mất dữ liệu tạm thời
  const isCreatingRef = useRef(false);

  const sessionId = propSessionId || searchParams.get("sessionId");
  const contextId = conversationId || sessionId;

  // ============================================================
  // 1. LOAD HISTORY (Tải lịch sử chat)
  // ============================================================
  useEffect(() => {
    const loadData = async () => {
      // Nếu đang trong quy trình tạo mới -> Dừng lại, không load history
      if (isCreatingRef.current) return;

      // 1. Tải từ database
      if (!contextId) {
        // ✅ CHỈ xóa tin nhắn nếu thực sự là trang trắng (không đang tạo mới, không có tin nhắn cũ)
        if (!isCreatingRef.current && messages.length === 0) {
          setMessages([]);
        }
        return;
      }

      setIsLoading(true);
      try {
        if (contextId.startsWith("temp-")) {
          setMessages([]);
          setIsLoading(false);
          return;
        }

        const history = await chatService.getChatHistory(contextId);

        // Logic khôi phục trạng thái upload tạm thời (nếu có từ trang trước)
        const navigationState = location.state as any;
        if (history.length > 0 && navigationState) {
          const firstUserMsgIndex = history.findIndex(
            (m) => m.sender === "user"
          );
          if (firstUserMsgIndex !== -1) {
            const updatedMsg = { ...history[firstUserMsgIndex] };
            if (navigationState.tempAttachment)
              updatedMsg.attachment = navigationState.tempAttachment;
            if (navigationState.tempDocs)
              updatedMsg.attachedDocuments = navigationState.tempDocs;
            history[firstUserMsgIndex] = updatedMsg;
          }
        }
        setMessages(history);
      } catch (error) {
        console.error("❌ Lỗi tải lịch sử chat:", error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [contextId, location.state]);

  // ============================================================
  // 2. LOGIC TẠO CONVERSATION MỚI (Từ HeroChat hoặc Input đầu tiên)
  // ============================================================
  const handleCreateNewConversation = async (
    messageText: string,
    file?: File
  ) => {
    isCreatingRef.current = true; // 🔒 Khóa useEffect lại

    // 1. Optimistic UI: Hiện ngay tin nhắn User và Loading AI
    const tempUserMsgId = `msg-user-${Date.now()}`;
    const tempAiMsgId = `msg-ai-temp-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: tempUserMsgId,
      text: messageText || (file ? `Phân tích file: ${file.name}` : ""),
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending",
      attachment: file
        ? { fileName: file.name, fileSize: file.size, fileType: file.type }
        : undefined,
      attachedDocuments:
        selectedDocuments.length > 0 ? selectedDocuments : undefined,
    };

    const aiPlaceholder: ChatMessage = {
      id: tempAiMsgId,
      text: "",
      sender: "ai",
      timestamp: new Date().toISOString(),
      status: "loading",
    };

    setMessages([userMessage, aiPlaceholder]);

    try {
      // 2. Upload file nếu có
      let uploadedDocId = null;
      if (file) {
        try {
          const doc = await documentService.uploadDocument(file, file.name);
          uploadedDocId = doc.id;
        } catch (e) {
          console.error("Upload failed", e);
          alert("Lỗi tải file. Vui lòng thử lại.");
          setMessages([]);
          isCreatingRef.current = false;
          return;
        }
      }

      // Chuẩn bị danh sách ID tài liệu
      const docIds = selectedDocuments
        .map((d) => parseInt(d.id, 10))
        .filter((id) => !isNaN(id));
      if (uploadedDocId) docIds.push(parseInt(String(uploadedDocId)));

      const title = messageText.substring(0, 50) || "Cuộc trò chuyện mới";

      // 3. Gọi Service tạo hội thoại
      // Lưu ý: chatService.createNewConversation đã bao gồm việc gửi query đầu tiên và chờ AI trả lời
      const newConv = await chatService.createNewConversation({
        title,
        initialMessage: messageText,
        documentIds: docIds.map(String),
      });

      if (!newConv || !newConv.id)
        throw new Error("Failed to create conversation");

      // 4. Lấy dữ liệu thật ngay lập tức (Bao gồm cả trích dẫn vừa tạo)
      const history = await chatService.getChatHistory(newConv.id);
      setMessages(history);

      // 5. Cập nhật Sidebar & Điều hướng URL
      if (onNewConversation) {
        onNewConversation(newConv);
      }

      // replace: true để thay thế lịch sử duyệt web, tránh user back lại trang trống
      navigate(`/user/chat/${newConv.id}`, { replace: true });

      // Mở khóa ref sau 1s để ổn định
      setTimeout(() => {
        isCreatingRef.current = false;
      }, 1000);
    } catch (error) {
      console.error("❌ Failed to start conversation:", error);
      setMessages([]);
      alert("Không thể bắt đầu cuộc trò chuyện. Vui lòng thử lại.");
      isCreatingRef.current = false;
    } finally {
      setIsReplying(false);
    }
  };

  // ============================================================
  // 3. HANDLE SEND MESSAGE (Gửi tin nhắn thông thường)
  // ============================================================
  const handleSendMessage = async (messageText: string, file?: File) => {
    if ((!messageText.trim() && !file) || isReplying) return;

    // Nếu chưa có ID -> Chuyển sang luồng tạo mới
    if (!contextId || contextId.startsWith("temp-")) {
      await handleCreateNewConversation(messageText, file);
      return;
    }

    setIsReplying(true);
    const currentConvId = parseInt(contextId, 10);

    // 1. Optimistic UI
    const userMessage: ChatMessage = {
      id: `msg-user-${Date.now()}`,
      text: messageText,
      sender: "user",
      timestamp: new Date().toISOString(),
      status: "sending",
      attachment: file
        ? { fileName: file.name, fileSize: file.size, fileType: file.type }
        : undefined,
      attachedDocuments:
        selectedDocuments.length > 0 ? selectedDocuments : undefined,
    };

    const aiPlaceholder: ChatMessage = {
      id: `msg-ai-temp-${Date.now()}`,
      text: "",
      sender: "ai",
      timestamp: new Date().toISOString(),
      status: "loading",
    };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);

    try {
      // 2. Upload file & Prepare IDs
      let uploadedDocId = null;
      if (file) {
        const doc = await documentService.uploadDocument(file, file.name);
        uploadedDocId = doc.id;
      }
      const docIds = selectedDocuments
        .map((d) => parseInt(d.id, 10))
        .filter((id) => !isNaN(id));
      if (uploadedDocId) docIds.push(parseInt(String(uploadedDocId)));

      // 3. Gửi câu hỏi
      const response = await queryApiService.sendQuery(
        messageText,
        docIds,
        5,
        currentConvId
      );

      // 4. Kiểm tra xem có cần Auto-Retry không (Do tài liệu đang được học)
      if (response.is_processing) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === aiPlaceholder.id
              ? { ...msg, text: "DocMentor đang đọc tài liệu của bạn để đưa ra câu trả lời chính xác nhất... ⏳", status: "loading" }
              : msg
          )
        );
        
        // Đợi 4 giây rồi thử lại chính câu hỏi này
        setTimeout(() => {
          handleSendMessage(messageText, undefined); // Không gửi lại file, chỉ gửi text
        }, 4000);
        return;
      }

      // 5. Map Sources (CamelCase)
      const mappedSources = (response.sources || []).map((s: any) => ({
        documentId: s.documentId ?? s.document_id ?? String(s.source_id ?? ""),
        documentTitle: s.documentTitle ?? s.document_title ?? s.title ?? "Tài liệu",
        pageNumber: s.pageNumber ?? s.page_number,
        similarityScore: s.similarityScore ?? s.similarity_score ?? s.score,
        text: s.text, // ✅ Nhận đoạn trích dẫn từ Backend
      }));

      // 6. Update State Hoàn tất
      setMessages((prev) =>
        prev.map((msg) => {
          if (msg.id === aiPlaceholder.id) {
            return {
              ...msg,
              id: `msg-ai-${response.query_id}`,
              text: response.answer,
              status: "sent",
              sources: mappedSources,
            };
          }
          if (msg.id === userMessage.id) return { ...msg, status: "sent" };
          return msg;
        })
      );
    } catch (error) {
      console.error("❌ Send message error:", error);
      // Xóa loading bubble nếu lỗi
      setMessages((prev) => prev.filter((m) => m.id !== aiPlaceholder.id));
      // Đánh dấu tin nhắn user bị lỗi
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessage.id ? { ...m, status: "error" } : m
        )
      );
      alert("Lỗi gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsReplying(false);
    }
  };

  // ============================================================
  // 4. RENDER
  // ============================================================

  // Loading khi mới vào trang (chỉ hiện khi không phải đang tạo mới)
  if (isLoading && !isCreatingRef.current) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-10 h-10 border-4 rounded-full border-primary/30 border-t-primary animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-transparent">
      {/* Hiển thị HeroChat khi:
         1. Chưa có tin nhắn nào
         2. VÀ không đang loading
         3. VÀ không đang trong quá trình reply
      */}
      {messages.length === 0 && !isLoading && !isReplying ? (
        <HeroChat onStartChat={handleSendMessage} />
      ) : (
        <>
          <div className="flex-1 px-4 overflow-y-auto custom-scrollbar">
            <MessageList
              messages={messages}
              isReplying={false}
              onEditMessage={() => {}}
            />
          </div>

          <ChatInput
            onSendMessage={handleSendMessage}
            isLoading={isReplying}
            selectedDocuments={selectedDocuments}
          />
        </>
      )}
    </div>
  );
};
