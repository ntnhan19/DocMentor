import React, { useState, useEffect } from "react";
import {
  useSearchParams,
  useNavigate,
  useParams,
  useLocation,
} from "react-router-dom";
import { useAuth } from "@/app/providers/AuthProvider";
import { ChatContainer } from "@/features/chat/components/ChatContainer";
import { DocumentSelectionModal } from "@/features/chat/components/DocumentSelectionModal";
import { Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";
import AppSidebar from "@/components/layout/AppSidebar";
import { RightSidebar } from "@/features/chat/components/RightSidebar";
import { FiSidebar } from "react-icons/fi";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [selectedDocuments, setSelectedDocuments] = useState<
    Array<{ id: string; title: string }>
  >([]);

  // --- LAYOUT STATE ---
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { conversationId: paramConvId } = useParams();
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isLoggedIn = !!user;
  const isGuestChat = pathname === "/chat" || pathname.startsWith("/chat/");
  const showSidebar = isLoggedIn && !isGuestChat;
  const guestSessionId = searchParams.get("sessionId");

  // --- LOAD DATA ---
  useEffect(() => {
    if (isLoggedIn) {
      chatService.getConversations().then(setConversations);
    }
  }, [isLoggedIn]);

  // LUÔN LUÔN lấy ID từ URL làm Priority 1
  const currentId = paramConvId || activeConversationId;

  // --- HANDLERS LEFT SIDEBAR ---
  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
    navigate(`/user/chat/${id}`);
  };

  const handleNewConversation = () => {
    setActiveConversationId(null);
    setSelectedDocuments([]);
    navigate("/user/chat");
  };

  const handleDeleteConversation = async (id: string) => {
    if (!window.confirm("Xóa cuộc trò chuyện?")) return;
    try {
      await chatService.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversationId === id) handleNewConversation();
    } catch (e) {
      console.error(e);
    }
  };
  const handleRenameConversation = async (id: string, title: string) => {
    try {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, title } : c))
      );
      await chatService.renameConversation(id, title);
    } catch (e) {
      console.error(e);
    }
  };
  const handlePinConversation = async (id: string, isPinned: boolean) => {
    try {
      setConversations((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isPinned } : c))
      );
      await chatService.updateConversation(id, { isPinned });
    } catch (e) {
      console.error(e);
    }
  };

  // --- HANDLERS RIGHT SIDEBAR ---
  const handleAddDocument = (doc: { id: string; title: string }) => {
    if (!selectedDocuments.some((d) => d.id === doc.id))
      setSelectedDocuments((prev) => [...prev, doc]);
  };
  const handleRemoveDocument = (docId: string) => {
    setSelectedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleCreateConversationFromHeroChat = (
    conversationId: string,
    initialMessage: string
  ) => {
    const newConv: Conversation = {
      id: conversationId,
      title: initialMessage.substring(0, 30) + "...",
      createdAt: new Date().toISOString(),
      isPinned: false,
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConversationId(conversationId);
    navigate(`/user/chat/${conversationId}`);
  };

  const handleOpenDocumentModal = () => {
    if (!activeConversationId) handleNewConversation();
    setIsDocumentModalOpen(true);
  };

  return (
    // ✅ FIX LAYOUT: Dùng fixed inset-0 để bao trọn màn hình, pt-16 để chừa chỗ cho Header
    <div className="fixed inset-0 w-full bg-[#100D20] pt-16 z-0 flex">
      {/* 1. LEFT SIDEBAR */}
      {showSidebar && (
        <AppSidebar
          isOpen={isLeftSidebarOpen}
          onClose={() => setIsLeftSidebarOpen(false)}
          chatProps={{
            conversations,
            activeConversationId,
            onSelectConversation: handleSelectConversation,
            onNewConversation: handleNewConversation,
            onDeleteConversation: handleDeleteConversation,
            onRenameConversation: handleRenameConversation,
            onPinConversation: handlePinConversation,
          }}
        />
      )}

      {/* 2. MAIN CONTENT */}
      <main
        className={`relative flex flex-col flex-1 h-full transition-all duration-300 ease-in-out min-w-0
          ${showSidebar && isLeftSidebarOpen ? "lg:ml-72" : "ml-0"} 
          ${showSidebar && isRightSidebarOpen ? "lg:mr-80" : "mr-0"}
      `}
      >
        {/* ✅ TOOLBAR: Cố định chiều cao h-14 (56px) */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 h-14 bg-[#100D20] border-b border-white/5 z-20">
          {/* Nút Mở Sidebar Trái (Chỉ hiện khi đóng) */}
          <div className="flex items-center gap-2">
            {showSidebar && !isLeftSidebarOpen && (
              <button
                onClick={() => setIsLeftSidebarOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-gray-400 bg-white/5 hover:bg-white/10 hover:text-white rounded-lg transition-all animate-fade-in"
                title="Mở Menu"
              >
                <FiSidebar className="w-4 h-4" /> <span>Menu</span>
              </button>
            )}
          </div>

          {/* Nút Mở Sidebar Phải (Chỉ hiện khi đóng) */}
          <div className="flex items-center gap-2">
            {!isRightSidebarOpen && (
              <button
                onClick={() => setIsRightSidebarOpen(true)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-all animate-fade-in ${selectedDocuments.length > 0 ? "text-secondary bg-secondary/10" : "text-gray-400 bg-white/5 hover:text-white"}`}
                title="Mở Ngữ cảnh"
              >
                <span>
                  {selectedDocuments.length > 0
                    ? `${selectedDocuments.length} Tài liệu`
                    : "Ngữ cảnh"}
                </span>
                <FiSidebar className="w-4 h-4 transform rotate-180" />
              </button>
            )}
          </div>
        </div>

        {/* ✅ FIX: Nền Chat đồng bộ, thêm chút gradient nhẹ */}
        <div className="flex-1 min-h-0 relative bg-gradient-to-b from-[#100D20] to-[#0d0a19]">
          <ChatContainer
            conversationId={
              isLoggedIn && !isGuestChat ? currentId : null
            }
            sessionId={!isLoggedIn || isGuestChat ? guestSessionId : null}
            initialFile={null}
            selectedDocuments={selectedDocuments}
            conversations={conversations}
            onOpenDocumentModal={handleOpenDocumentModal}
            // ✅ BỔ SUNG: Update sidebar và active ID khi xong
            onNewConversation={(conv) => {
              setConversations((prev) => {
                if (prev.some(c => c.id === conv.id)) return prev;
                return [conv, ...prev];
              });
              setActiveConversationId(conv.id);
            }}
            onCreateConversationFromHeroChat={
              isLoggedIn && !isGuestChat
                ? handleCreateConversationFromHeroChat
                : undefined
            }
          />
        </div>
      </main>

      {/* 3. RIGHT SIDEBAR */}
      {showSidebar && (
        <RightSidebar
          isOpen={isRightSidebarOpen}
          onClose={() => setIsRightSidebarOpen(false)}
          selectedDocuments={selectedDocuments}
          onRemoveDocument={handleRemoveDocument}
          onAddDocument={handleAddDocument}
        />
      )}

      {/* Modal (Fallback) */}
      {isLoggedIn && !isGuestChat && (
        <DocumentSelectionModal
          isOpen={isDocumentModalOpen}
          onClose={() => setIsDocumentModalOpen(false)}
          onDocumentsSelected={(docs) => {
            docs.forEach((doc) => handleAddDocument(doc));
            setIsDocumentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatPage;
