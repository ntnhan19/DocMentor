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

      // 3. Tạo cuộc trò chuyện RỖNG trước (Để lấy ID)
      const newConvResponse = await chatService.createEmptyConversation({
        title,
        documentIds: docIds.map(String),
      });

      if (!newConvResponse || !newConvResponse.id)
        throw new Error("Failed to create conversation");

      // Cập nhật Sidebar & Điều hướng URL ngay lập tức
      if (onNewConversation) {
        onNewConversation(newConvResponse);
      }
      navigate(`/user/chat/${newConvResponse.id}`, { replace: true });

      // 4. Thực hiện STREAMING cho câu hỏi đầu tiên
      let accumulatedText = "";

      await queryApiService.sendQueryStream(
        messageText,
        docIds,
        (data) => {
          if (data.is_processing) {
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempAiMsgId
                  ? { ...msg, text: "DocMentor đang học tài liệu... ⏳", status: "loading" }
                  : msg
              )
            );
            return;
          }

          if (data.chunk) {
            accumulatedText += data.chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempAiMsgId
                  ? { ...msg, text: accumulatedText, status: "sent" }
                  : msg
              )
            );
          }

          if (data.is_done) {
            const mappedSources = (data.sources || []).map((s: any) => ({
              documentId: s.documentId ?? s.document_id ?? String(s.source_id ?? ""),
              documentTitle: s.documentTitle ?? s.document_title ?? s.title ?? "Tài liệu",
              pageNumber: s.pageNumber ?? s.page_number,
              similarityScore: s.similarityScore ?? s.similarity_score ?? s.score,
              text: s.text,
            }));

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === tempAiMsgId
                  ? { 
                      ...msg, 
                      id: `msg-ai-${data.query_id}`, 
                      text: data.answer || accumulatedText, 
                      sources: mappedSources,
                      status: "sent" 
                    }
                  : msg
              )
            );
          }
        },
        parseInt(newConvResponse.id, 10)
      );

      // Mở khóa sau 1s
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
  // 3. HANDLE SEND MESSAGE (Gửi tin nhắn thông thường - STREAMING)
  // ============================================================
  const handleSendMessage = async (messageText: string, file?: File) => {
    if ((!messageText.trim() && !file) || isReplying) return;

    // Nếu chưa có ID -> Chuyển sang luồng tạo mới (Cũng sẽ dùng streaming)
    if (!contextId || contextId.startsWith("temp-")) {
      await handleCreateNewConversation(messageText, file);
      return;
    }

    setIsReplying(true);
    const currentConvId = parseInt(contextId, 10);

    // 1. Optimistic UI: Tạo tin nhắn user và placeholder cho AI
    const userMessageId = `msg-user-${Date.now()}`;
    const aiMessageId = `msg-ai-temp-${Date.now()}`;

    const userMessage: ChatMessage = {
      id: userMessageId,
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
      id: aiMessageId,
      text: "",
      sender: "ai",
      timestamp: new Date().toISOString(),
      status: "loading",
    };

    setMessages((prev) => [...prev, userMessage, aiPlaceholder]);

    try {
      // 2. Upload file & Prepare IDs (nếu có)
      let uploadedDocId = null;
      if (file) {
        const doc = await documentService.uploadDocument(file, file.name);
        uploadedDocId = doc.id;
      }
      const docIds = selectedDocuments
        .map((d) => parseInt(d.id, 10))
        .filter((id) => !isNaN(id));
      if (uploadedDocId) docIds.push(parseInt(String(uploadedDocId)));

      // 3. Thực hiện STREAMING từ API
      let accumulatedText = "";

      await queryApiService.sendQueryStream(
        messageText,
        docIds,
        (data) => {
          // XỬ LÝ TỪNG CHUNK DỮ LIỆU
          if (data.is_processing) {
            // Trường hợp tài liệu đang được học
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, text: "DocMentor đang nạp tài liệu vào bộ nhớ để trả lời chính xác nhất... ⏳", status: "loading" }
                  : msg
              )
            );
            
            setTimeout(() => {
              handleSendMessage(messageText, undefined); // Thử lại sau 4s
            }, 4000);
            return;
          }

          if (data.chunk) {
            accumulatedText += data.chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { ...msg, text: accumulatedText, status: "sent" } // Hiển thị chữ chạy
                  : msg
              )
            );
          }

          if (data.is_done) {
            // Khi kết thúc: Cập nhật Sources và Query ID thật
            const mappedSources = (data.sources || []).map((s: any) => ({
              documentId: s.documentId ?? s.document_id ?? String(s.source_id ?? ""),
              documentTitle: s.documentTitle ?? s.document_title ?? s.title ?? "Tài liệu",
              pageNumber: s.pageNumber ?? s.page_number,
              similarityScore: s.similarityScore ?? s.similarity_score ?? s.score,
              text: s.text,
            }));

            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === aiMessageId
                  ? { 
                      ...msg, 
                      id: `msg-ai-${data.query_id}`, 
                      text: data.answer || accumulatedText, 
                      sources: mappedSources,
                      status: "sent" 
                    }
                  : msg
              )
            );
            setIsReplying(false);
          }
        },
        currentConvId
      );

      // Đánh dấu tin nhắn user đã gửi xong
      setMessages((prev) =>
        prev.map((m) => (m.id === userMessageId ? { ...m, status: "sent" } : m))
      );

    } catch (error) {
      console.error("❌ Send message error:", error);
      setMessages((prev) => prev.filter((m) => m.id !== aiMessageId));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === userMessageId ? { ...m, status: "error" } : m
        )
      );
      alert("Cỗ máy AI đang bận hoặc gặp sự cố. Vui lòng thử lại.");
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
        <div className="w-12 h-12 border-[3px] rounded-full border-white/10 border-t-white animate-spin"></div>
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
