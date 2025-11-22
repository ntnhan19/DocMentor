import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  useSearchParams,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ChatContainer } from "@/features/chat/components/ChatContainer";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";
import { DocumentSelectionModal } from "@/features/chat/components/DocumentSelectionModal";
import { Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null); // ✨ ĐÃ XÓA: pendingFile không còn cần thiết
  // ✨ THÊM: State cho Document Selection Modal

  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    Array<{ id: string; title: string }>
  >([]);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { conversationId: paramConvId } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;

  const hasHandledDocIds = useRef(false);

  const isGuestChat = pathname === "/chat" || pathname.startsWith("/chat/");
  const showSidebar = isLoggedIn && !isGuestChat;

  const guestSessionId = searchParams.get("sessionId"); // --- CHỨC NĂNG TẢI TÀI LIỆU TỪ ID ---

  const loadDocumentsFromIds = useCallback(async (docIds: string[]) => {
    try {
      // FIX: Tạm thời sử dụng fetch trực tiếp để đơn giản hóa, nên dùng documentApiService
      const auth_token = localStorage.getItem("auth_token") || "";
      const docs = await Promise.all(
        docIds.map(async (id) => {
          const res = await fetch(`http://localhost:8000/documents/${id}`, {
            headers: { Authorization: `Bearer ${auth_token}` },
          });
          if (!res.ok) throw new Error(`Failed to fetch document ${id}`);
          return res.json();
        })
      );
      setSelectedDocuments(
        docs.map((doc) => ({
          id: String(doc.id), // Đảm bảo ID là string
          title: doc.title,
        }))
      );
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  }, []); // ✨ THÊM: useEffect để check localStorage từ DocumentsPage

  useEffect(() => {
    const savedDocIds = localStorage.getItem("selectedDocIds");
    if (savedDocIds && isLoggedIn) {
      try {
        const docIds = JSON.parse(savedDocIds); // Tải và set documents
        loadDocumentsFromIds(docIds);
        localStorage.removeItem("selectedDocIds");
      } catch (error) {
        console.error("Error loading saved doc IDs:", error);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); // ✨ THAY ĐỔI: Tách useEffect cho docIds xử lý

  useEffect(() => {
    const docIdsString = searchParams.get("docIds"); // ✨ CHỈ XỬ LÝ NẾU CHO CHỈ LẦN ĐẦU và có docIds

    if (isLoggedIn && docIdsString && !hasHandledDocIds.current) {
      hasHandledDocIds.current = true;
      // Gọi hàm load documents để set selectedDocuments
      loadDocumentsFromIds(docIdsString.split(",")); // Chuyển hướng để xóa query params
      navigate("/user/chat", { replace: true });
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, loadDocumentsFromIds]); // ✨ THÊM: useEffect riêng cho initial conversations loading

  useEffect(() => {
    if (isLoggedIn && !searchParams.get("docIds")) {
      loadInitialConversations();

      if (paramConvId) {
        setActiveConversationId(paramConvId);
      }
    } // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, paramConvId]); // Hàm xử lý tạo Conversation với Documents

  const handleNewConversationWithDocs = async (docIds: string[]) => {
    try {
      console.log("Creating conversation with docs:", docIds); // FIX: Thay vì gọi createConversationWithContext, gọi createNewConversation

      const stringDocIds = docIds.map((id) => String(id));
      const initialMessage = `Phân tích ${stringDocIds.length} tài liệu đã chọn.`;

      const newConv = await chatService.createNewConversation({
        title: `Trò chuyện về ${stringDocIds.length} tài liệu`,
        initialMessage: initialMessage,
        documentIds: stringDocIds,
      });

      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id); // ✨ Clear query params sau khi xử lý xong

      navigate(`/user/chat/${newConv.id}`, { replace: true });
    } catch (error) {
      console.error("Failed to create new conversation with documents:", error);
      alert("Đã có lỗi xảy ra khi tạo cuộc trò chuyện mới. Vui lòng thử lại.");
      if (isLoggedIn) loadInitialConversations();
    }
  };

  const loadInitialConversations = async () => {
    const data = await chatService.getConversations();
    setConversations(data);
  };

  const handleNewConversation = () => {
    const newConv: Conversation = {
      id: `conv-${Date.now()}`,
      title: "Cuộc trò chuyện mới",
      createdAt: new Date().toISOString(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
  };

  const handleDeleteConversation = async (id: string) => {
    await chatService.deleteConversation(id);
    const updatedConvs = conversations.filter((c) => c.id !== id);
    setConversations(updatedConvs);
    if (activeConversationId === id) {
      setActiveConversationId(null);
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    await chatService.renameConversation(id, newTitle);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  }; // ✨ CẬP NHẬT: Handler này giờ nhận thêm documentIds

  const handleCreateConversationFromHeroChat = (
    conversationId: string,
    initialMessage: string,
    documentIds?: string[] // NHẬN documentIds TỪ ChatContainer
  ) => {
    console.log(
      "✓ handleCreateConversationFromHeroChat called:",
      conversationId,
      initialMessage,
      documentIds
    );

    // Nếu có documentIds, chúng ta tạo Conversation với documentIds.
    // Nếu không, chúng ta chỉ tạo Conversation bình thường.

    const conversationExists = conversations.some(
      (c) => c.id === conversationId
    );

    if (!conversationExists) {
      const newConv: Conversation = {
        id: conversationId,
        title:
          initialMessage.substring(0, 50) +
          (initialMessage.length > 50 ? "..." : ""),
        createdAt: new Date().toISOString(),
      }; // Cập nhật danh sách conversations
      setConversations((prev) => [newConv, ...prev]);
      console.log("✓ Conversation added to sidebar:", conversationId);
    } else {
      console.log("⚠ Conversation already exists:", conversationId);
    }

    setActiveConversationId(conversationId);
    console.log("✓ Active conversation set to:", conversationId); // FIX: Đảm bảo chuyển hướng sau khi set active ID
    navigate(`/user/chat/${conversationId}`, { replace: true });
  }; // Handler cho Document Selection Modal

  const handleDocumentsSelected = (
    documents: Array<{ id: string; title: string }>
  ) => {
    setSelectedDocuments(documents);
    setIsDocumentModalOpen(false); // FIX: Gọi hàm tạo conversation mới ngay sau khi chọn tài liệu

    const docIds = documents.map((d) => d.id);
    handleNewConversationWithDocs(docIds);
  }; // ✨ THÊM: Handler để remove document

  const handleRemoveDocument = (docId: string) => {
    setSelectedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
            {/* Background */}     {" "}
      <div className="fixed inset-0 pointer-events-none">
               {" "}
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
               {" "}
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
             {" "}
      </div>
           {" "}
      {/* ✨ CHỈ HIỂN THỊ SIDEBAR KHI USER LOGIN VÀ KHÔNG PHẢI GUEST CHAT */}   
       {" "}
      {showSidebar && (
        <div className="relative z-10 animate-slide-in-left w-80 flex-shrink-0">
                   {" "}
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
          />
                 {" "}
        </div>
      )}
            {/* ✨ MAIN CONTENT - FULL WIDTH KHI GUEST */}     {" "}
      <main
        className={`relative z-10 animate-fade-in ${
          showSidebar ? "flex-1" : "w-full"
        }`}
      >
               {" "}
        <div
          className={`h-full ${
            showSidebar
              ? "bg-accent/30 backdrop-blur-sm border-l border-primary/10"
              : "bg-background"
          }`}
        >
                   {" "}
          <ChatContainer
            conversationId={
              isLoggedIn && !isGuestChat ? activeConversationId : null
            }
            sessionId={!isLoggedIn || isGuestChat ? guestSessionId : null}
            initialFile={null} // ✨ KHÔNG DÙNG: pendingFile nữa
            selectedDocuments={selectedDocuments}
            onOpenDocumentModal={() => setIsDocumentModalOpen(true)}
            onRemoveDocument={handleRemoveDocument}
            onCreateConversationFromHeroChat={
              isLoggedIn && !isGuestChat
                ? handleCreateConversationFromHeroChat
                : undefined
            }
          />
                 {" "}
        </div>
             {" "}
      </main>
            {/* ✨ THÊM: Document Selection Modal */}     {" "}
      {isLoggedIn && !isGuestChat && (
        <DocumentSelectionModal
          isOpen={isDocumentModalOpen}
          onClose={() => {
            setIsDocumentModalOpen(false);
          }}
          onDocumentsSelected={handleDocumentsSelected}
        />
      )}
         {" "}
    </div>
  );
};

export default ChatPage;
