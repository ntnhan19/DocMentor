//============================================
// ChatSidebar.tsx
// ============================================
import React, { useState } from "react";
import { Conversation } from "@/types/chat.types";

interface ChatSidebarProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  const handleRename = (id: string, currentTitle: string) => {
    setEditingId(id);
    setRenameValue(currentTitle);
  };

  const handleRenameSubmit = (id: string) => {
    if (renameValue.trim()) {
      onRenameConversation(id, renameValue.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="h-full flex flex-col p-4 bg-gradient-to-b from-accent/60 to-accent/40 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={onNewConversation}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white px-4 py-3 rounded-xl font-medium shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <span>Cuộc trò chuyện mới</span>
        </button>
      </div>

      {/* Title */}
      <h2 className="text-lg font-bold text-white mb-4 px-2">Lịch sử chat</h2>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            onClick={() => onSelectConversation(conv.id)}
            className={`group relative p-3 rounded-xl cursor-pointer transition-all duration-300 ${
              activeConversationId === conv.id
                ? "bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/40 shadow-lg shadow-primary/10"
                : "bg-accent/40 border border-primary/10 hover:border-primary/30 hover:bg-accent/60"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              {editingId === conv.id ? (
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onBlur={() => handleRenameSubmit(conv.id)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && handleRenameSubmit(conv.id)
                  }
                  className="flex-1 bg-accent/60 border border-primary/30 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-primary/50"
                  autoFocus
                />
              ) : (
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <span className="truncate text-white text-sm font-medium">
                    {conv.title}
                  </span>
                </div>
              )}

              {editingId !== conv.id && (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(conv.id, conv.title);
                    }}
                    className="p-1.5 rounded-lg bg-accent/60 text-text-muted hover:text-primary hover:bg-accent/80 transition-all duration-300"
                    title="Đổi tên"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteConversation(conv.id);
                    }}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all duration-300"
                    title="Xóa"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
