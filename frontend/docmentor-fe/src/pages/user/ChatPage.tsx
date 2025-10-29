// src/pages/user/ChatPage.tsx

import React, { useState, useEffect } from "react";
// ✨ 1. Import hooks from react-router-dom to read the URL
import { useSearchParams, useNavigate } from "react-router-dom";
import { ChatContainer } from "@/features/chat/components/ChatContainer";
import { ChatSidebar } from "@/features/chat/components/ChatSidebar";
import { Conversation } from "@/types/chat.types";
import { chatService } from "@/services/chat/chatService";

const ChatPage: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  // ✨ 2. Initialize the hooks
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✨ 3. This is the core logic that runs when the page loads
  useEffect(() => {
    const docIdsString = searchParams.get("docIds");

    // Scenario 1: User arrives from DocumentsPage with selected docs
    if (docIdsString) {
      const docIds = docIdsString.split(",");
      // Create a new conversation with the context of these documents
      handleNewConversationWithDocs(docIds);
    }
    // Scenario 2: User accesses /chat directly
    else {
      // Just load the existing conversation history
      loadInitialConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // The empty dependency array ensures this runs only ONCE on initial load

  /**
   * ✨ 4. Creates a new conversation using document IDs as context.
   * This function calls the backend to create the conversation.
   */
  const handleNewConversationWithDocs = async (docIds: string[]) => {
    try {
      // This is where you call your backend API
      const newConv = await chatService.createConversationWithContext(docIds);

      // Add the new conversation to the top of the list and make it active
      setConversations((prev) => [newConv, ...prev]);
      setActiveConversationId(newConv.id);

      // IMPORTANT: Clean the URL to remove the docIds query parameter.
      // This prevents re-creating the conversation if the user refreshes the page.
      navigate("/chat", { replace: true });
    } catch (error) {
      console.error("Failed to create new conversation with documents:", error);
      alert("Đã có lỗi xảy ra khi tạo cuộc trò chuyện mới. Vui lòng thử lại.");
      // Fallback to loading normal history if creation fails
      loadInitialConversations();
    }
  };

  /**
   * Loads the user's existing conversation history.
   */
  const loadInitialConversations = async () => {
    const data = await chatService.getConversations();
    setConversations(data); // If no conversation is active, select the first one by default
    if (data.length > 0 && !activeConversationId) {
      setActiveConversationId(data[0].id);
    }
  }; // --- Your Original Handler Functions (Unchanged) ---

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
      setActiveConversationId(
        updatedConvs.length > 0 ? updatedConvs[0].id : null
      );
    }
  };

  const handleRenameConversation = async (id: string, newTitle: string) => {
    await chatService.renameConversation(id, newTitle);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle } : c))
    );
  };

  return (
    // --- Your Original JSX (Unchanged) ---
    <div className="flex h-[calc(100vh-60px)] bg-background overflow-hidden">
           {" "}
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
      <div className="relative z-10 animate-slide-in-left">
               {" "}
        <ChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={setActiveConversationId}
          onNewConversation={handleNewConversation}
          onDeleteConversation={handleDeleteConversation}
          onRenameConversation={handleRenameConversation}
        />
             {" "}
      </div>
           {" "}
      <main className="flex-1 relative z-10 animate-fade-in">
               {" "}
        <div className="h-full bg-accent/30 backdrop-blur-sm border-l border-primary/10">
                    <ChatContainer conversationId={activeConversationId} />     
           {" "}
        </div>
             {" "}
      </main>
         {" "}
    </div>
  );
};

export default ChatPage;
