// src/pages/user/ChatPage.tsx

import React, { useState, useEffect, useRef } from "react";
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
  >(null);

  // ✨ THÊM: State cho file từ DocumentsPage
  const [pendingFile, setPendingFile] = useState<File | null>(null);

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

  const guestSessionId = searchParams.get("sessionId");

  // ✨ THÊM: useEffect để extract file từ location state
  useEffect(() => {
    const state = (window.history.state?.usr as any) || null;
    if (state?.initialFile) {
      setPendingFile(state.initialFile);
    }
  }, []);

  // ✨ THÊM: useEffect để check localStorage từ DocumentsPage
  useEffect(() => {
    const savedDocIds = localStorage.getItem("selectedDocIds");
    if (savedDocIds && isLoggedIn) {
      try {
        const docIds = JSON.parse(savedDocIds);
        // Tải và set documents
        loadDocumentsFromIds(docIds);
        localStorage.removeItem("selectedDocIds");
      } catch (error) {
        console.error("Error loading saved doc IDs:", error);
      }
    }
  }, [isLoggedIn]);

  // ✨ THÊM: Function để load documents từ IDs
  const loadDocumentsFromIds = async (docIds: string[]) => {
    try {
      const docs = await Promise.all(
        docIds.map((id) =>
          fetch(`/api/documents/${id}`).then((res) => res.json())
        )
      );
      setSelectedDocuments(
        docs.map((doc) => ({
          id: doc.id,
          title: doc.title,
        }))
      );
    } catch (error) {
      console.error("Error loading documents:", error);
    }
  };

  // ✨ THAY ĐỔI: Tách useEffect cho docIds xử lý
  useEffect(() => {
    const docIdsString = searchParams.get("docIds");

    // ✨ CHỈ XỬ LÝ NẾUCHO CHỈ LẦN ĐẦU và có docIds
    if (isLoggedIn && docIdsString && !hasHandledDocIds.current) {
      hasHandledDocIds.current = true;
      handleNewConversationWithDocs(docIdsString.split(","));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); // ✨ CHỈ phụ thuộc vào isLoggedIn

  // ✨ THÊM: useEffect riêng cho initial conversations loading
  useEffect(() => {
    if (isLoggedIn && !searchParams.get("docIds")) {
      loadInitialConversations();

      if (paramConvId) {
        setActiveConversationId(paramConvId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, paramConvId]);

  const handleNewConversationWithDocs = async (docIds: string[]) => {
    try {
      console.log("Creating conversation with docs:", docIds);

      // Ensure we pass string[] to the chat service (it expects strings)
      const stringDocIds = docIds.map((id) => String(id));
      const newConv =
        await chatService.createConversationWithContext(stringDocIds);
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);

      // ✨ Clear query params sau khi xử lý xong
      navigate("/user/chat", { replace: true });
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
  };

  const handleCreateConversationFromHeroChat = (
    conversationId: string,
    initialMessage: string
  ) => {
    console.log(
      "✓ handleCreateConversationFromHeroChat called:",
      conversationId,
      initialMessage
    );

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
      };

      setConversations((prev) => [newConv, ...prev]);
      console.log("✓ Conversation added to sidebar:", conversationId);
    } else {
      console.log("⚠ Conversation already exists:", conversationId);
    }

    setActiveConversationId(conversationId);
    console.log("✓ Active conversation set to:", conversationId);
  };

  // ✨ THÊM: Handler cho Document Selection
  const handleDocumentsSelected = (
    documents: Array<{ id: string; title: string }>
  ) => {
    setSelectedDocuments(documents);
    setIsDocumentModalOpen(false);
  };

  // ✨ THÊM: Handler để remove document
  const handleRemoveDocument = (docId: string) => {
    setSelectedDocuments((prev) => prev.filter((d) => d.id !== docId));
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-background overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* ✨ CHỈ HIỂN THỊ SIDEBAR KHI USER LOGIN VÀ KHÔNG PHẢI GUEST CHAT */}
      {showSidebar && (
        <div className="relative z-10 animate-slide-in-left w-80 flex-shrink-0">
          <ChatSidebar
            conversations={conversations}
            activeConversationId={activeConversationId}
            onSelectConversation={handleSelectConversation}
            onNewConversation={handleNewConversation}
            onDeleteConversation={handleDeleteConversation}
            onRenameConversation={handleRenameConversation}
          />
        </div>
      )}

      {/* ✨ MAIN CONTENT - FULL WIDTH KHI GUEST */}
      <main
        className={`relative z-10 animate-fade-in ${
          showSidebar ? "flex-1" : "w-full"
        }`}
      >
        <div
          className={`h-full ${
            showSidebar
              ? "bg-accent/30 backdrop-blur-sm border-l border-primary/10"
              : "bg-background"
          }`}
        >
          <ChatContainer
            conversationId={
              isLoggedIn && !isGuestChat ? activeConversationId : null
            }
            sessionId={!isLoggedIn || isGuestChat ? guestSessionId : null}
            initialFile={pendingFile} // ✨ DÙNG: pendingFile
            selectedDocuments={selectedDocuments}
            onOpenDocumentModal={() => setIsDocumentModalOpen(true)}
            onRemoveDocument={handleRemoveDocument}
            onCreateConversationFromHeroChat={
              isLoggedIn && !isGuestChat
                ? handleCreateConversationFromHeroChat
                : undefined
            }
          />
        </div>
      </main>

      {/* ✨ THÊM: Document Selection Modal */}
      {isLoggedIn && !isGuestChat && (
        <DocumentSelectionModal
          isOpen={isDocumentModalOpen}
          onClose={() => {
            if (selectedDocuments.length > 0) {
              setIsDocumentModalOpen(false);
            }
          }}
          onDocumentsSelected={handleDocumentsSelected}
        />
      )}
    </div>
  );
};

export default ChatPage;
