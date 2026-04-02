// src/components/layout/AppSidebar.tsx

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Conversation } from "@/types/chat.types";
import { realAuthService, User } from "@/services/auth/authService";
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiFileText,
  FiHome,
  FiFolder,
  FiSettings,
  FiLogOut,
  FiMessageSquare,
  FiSidebar,
} from "react-icons/fi";
import { TbPin } from "react-icons/tb";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { RiChatHistoryLine } from "react-icons/ri";

// --- TYPES ---
interface ChatProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  onPinConversation?: (id: string, isPinned: boolean) => void;
}

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  chatProps?: ChatProps;
}

interface GroupedConversations {
  pinned: Conversation[];
  today: Conversation[];
  yesterday: Conversation[];
  thisWeek: Conversation[];
  thisMonth: Conversation[];
  older: Conversation[];
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isOpen,
  onClose,
  chatProps,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);

  // --- STATE ---
  const [editingId, setEditingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedConversations, setPinnedConversations] = useState<Set<string>>(
    new Set()
  );
  const [groupedConversations, setGroupedConversations] =
    useState<GroupedConversations>({
      pinned: [],
      today: [],
      yesterday: [],
      thisWeek: [],
      thisMonth: [],
      older: [],
    });

  // --- 1. FETCH USER ---
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await realAuthService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await realAuthService.logout();
    setUser(null);
    navigate("/login");
  };

  // --- 2. GROUP LOGIC ---
  useEffect(() => {
    if (!chatProps) return;

    const groupConversationsByTime = (convs: Conversation[]) => {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);

      const groups: GroupedConversations = {
        pinned: [],
        today: [],
        yesterday: [],
        thisWeek: [],
        thisMonth: [],
        older: [],
      };

      convs.forEach((conv) => {
        if (pinnedConversations.has(conv.id) || conv.isPinned) {
          groups.pinned.push(conv);
          return;
        }

        const dateStr = conv.updatedAt || conv.createdAt;
        const convDate = new Date(dateStr);
        const convDay = new Date(
          convDate.getFullYear(),
          convDate.getMonth(),
          convDate.getDate()
        );

        if (convDay.getTime() === today.getTime()) groups.today.push(conv);
        else if (convDay.getTime() === yesterday.getTime())
          groups.yesterday.push(conv);
        else if (convDate > weekAgo) groups.thisWeek.push(conv);
        else if (convDate > monthAgo) groups.thisMonth.push(conv);
        else groups.older.push(conv);
      });

      // Sort recent first
      const sortDesc = (a: Conversation, b: Conversation) =>
        new Date(b.updatedAt || b.createdAt).getTime() -
        new Date(a.updatedAt || a.createdAt).getTime();

      Object.keys(groups).forEach((key) =>
        groups[key as keyof GroupedConversations].sort(sortDesc)
      );
      return groups;
    };

    let filtered = chatProps.conversations;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = chatProps.conversations.filter((conv) =>
        conv.title.toLowerCase().includes(query)
      );
    }
    setGroupedConversations(groupConversationsByTime(filtered));
  }, [chatProps?.conversations, searchQuery, pinnedConversations]);

  // --- HANDLERS ---
  const handleRenameStart = (id: string, currentTitle: string) => {
    setEditingId(id);
    setRenameValue(currentTitle);
  };

  const handleRenameSubmit = (id: string) => {
    if (
      renameValue.trim() &&
      renameValue.trim() !==
        chatProps?.conversations.find((c) => c.id === id)?.title
    ) {
      chatProps?.onRenameConversation(id, renameValue.trim());
    }
    setEditingId(null);
  };

  const handlePinClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newPinned = new Set(pinnedConversations);
    if (newPinned.has(id)) newPinned.delete(id);
    else newPinned.add(id);
    setPinnedConversations(newPinned);
    chatProps?.onPinConversation?.(id, !pinnedConversations.has(id));
  };

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirm(id);
  };

  const handleConfirmDelete = (id: string) => {
    chatProps?.onDeleteConversation(id);
    setShowDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      if (diffMins < 1) return "Vừa xong";
      if (diffMins < 60) return `${diffMins}p`;
      if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    } catch {
      return "";
    }
  };

  // --- SUB-COMPONENT: CONVERSATION ITEM ---
  const ConversationItem: React.FC<{ conv: Conversation }> = ({ conv }) => {
    const isActive = chatProps?.activeConversationId === conv.id;
    const isTemp = conv.id.startsWith("temp-");
    const isEditing = editingId === conv.id;
    const showDelete = showDeleteConfirm === conv.id;
    const isPinned = pinnedConversations.has(conv.id) || conv.isPinned;
    const docCount =
      conv.documentCount || (conv.documents ? conv.documents.length : 0);

    return (
      <div
        onClick={() =>
          !isEditing && !showDelete && chatProps?.onSelectConversation(conv.id)
        }
        className={`group relative p-2.5 rounded-2xl cursor-pointer transition-all duration-300 border ${
          isActive
            ? "bg-white text-black border-white/20 shadow-xl shadow-white/5"
            : "bg-transparent border-transparent hover:bg-white/5"
        }`}
      >
        {/* DELETE CONFIRM OVERLAY */}
        {showDelete && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/95 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleConfirmDelete(conv.id);
                }}
                className="px-4 py-1.5 text-[11px] font-bold text-black bg-white rounded-lg hover:bg-white/90"
              >
                Xóa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(null);
                }}
                className="px-4 py-1.5 text-[11px] font-medium text-white/50 rounded-lg hover:text-white transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        <div className="flex items-start gap-3">
          <div
            className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center mt-0.5 transition-colors ${
              isActive 
                ? "bg-black text-white" 
                : isTemp 
                  ? "bg-white/5 text-white/40 animate-pulse" 
                  : "bg-white/10 text-white/70 group-hover:text-white"
            }`}
          >
            <HiOutlineChatBubbleLeftRight className="w-4 h-5" />
          </div>

          <div className="relative flex-1 min-w-0 overflow-hidden">
            {isEditing ? (
              // --- EDIT MODE ---
              <div className="flex items-center gap-1 h-9">
                <input
                  type="text"
                  value={renameValue}
                  onChange={(e) => setRenameValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleRenameSubmit(conv.id);
                    if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                  className="flex-1 min-w-0 bg-black/20 border border-white/20 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            ) : (
              // --- VIEW MODE ---
              <>
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-[13px] truncate pr-12 ${isActive ? "text-black font-semibold" : "text-white/70 group-hover:text-white"}`}
                  >
                    {conv.title}
                  </h3>

                  {isPinned && (
                    <TbPin
                      size={12}
                      className={`${isActive ? "text-black/60" : "text-white/40"} absolute top-0.5 right-0`}
                    />
                  )}
                </div>

                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] ${isActive ? "text-black/40" : "text-white/30"}`}>
                    {formatDate(conv.updatedAt || conv.createdAt)}
                  </span>
                  {docCount > 0 && (
                    <span className={`flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${isActive ? "text-black/60 border-black/10" : "text-white/50 bg-white/5 border-white/10"}`}>
                      <FiFileText size={10} /> {docCount}
                    </span>
                  )}
                </div>

                {/* --- ACTION BUTTONS (Hover) --- */}
                <div className="absolute right-0 top-0 hidden group-hover:flex items-center gap-0.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-xl p-1 z-10 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={(e) => handlePinClick(conv.id, e)}
                    className={`p-1.5 rounded-lg transition-colors ${isPinned ? "text-white bg-white/20" : "text-white/40 hover:text-white hover:bg-white/10"}`}
                  >
                    <TbPin size={13} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRenameStart(conv.id, conv.title);
                    }}
                    className="p-1.5 text-white/40 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <FiEdit2 size={13} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(conv.id, e)}
                    className="p-1.5 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <FiTrash2 size={13} />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  const displayName = user?.full_name || user?.email?.split("@")[0] || "Khách";
  const avatarSrc = user?.avatar_url;
  const initial = displayName.charAt(0).toUpperCase();

  // --- RENDER MAIN ---
  return (
    <aside
      className={`fixed top-16 left-0 h-[calc(100vh-4rem)] bg-black border-r border-white/5 z-30 transition-transform duration-300 w-72 flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* 1. HEADER SIDEBAR */}
      <div className="flex items-center justify-between flex-shrink-0 px-5 border-b h-14 border-white/5">
        <span className="text-[10px] font-bold tracking-[0.15em] text-white/30 uppercase">
          Menu Chính
        </span>
        <button
          onClick={onClose}
          className="p-2 text-white/30 rounded-xl hover:text-white hover:bg-white/5 transition-all"
        >
          <FiSidebar size={15} className="transform rotate-180" />
        </button>
      </div>

      {/* 2. Navigation */}
      <div className="flex-shrink-0 px-3 py-4">
        <nav className="space-y-1">
          {[
            { label: "Dashboard", path: "/user/dashboard", icon: <FiHome size={18} /> },
            {
              label: "Tài liệu của tôi",
              path: "/user/documents",
              icon: <FiFolder size={18} />,
            },
            {
              label: "Chat AI",
              path: "/user/chat",
              icon: <HiOutlineChatBubbleLeftRight size={18} />,
            },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[14px] transition-all ${
                location.pathname.startsWith(item.path) 
                  ? "bg-white text-black font-semibold shadow-xl" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              <span className={location.pathname.startsWith(item.path) ? "text-black" : "text-inherit"}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          ))}
          <Link
            to="/user/settings"
            className="flex items-center gap-3 px-4 py-2.5 mx-0 text-[14px] text-white/40 transition-all rounded-xl hover:text-white hover:bg-white/5"
          >
            <FiSettings size={18} /> Cài đặt
          </Link>
        </nav>
      </div>

      <div className="h-px mx-6 bg-white/5"></div>

      {/* 3. Chat History */}
      {chatProps ? (
        <div className="flex flex-col flex-1 min-h-0">
          <div className="px-5 py-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="flex items-center gap-2 text-[10px] font-bold tracking-[0.15em] text-white/30 uppercase">
                <RiChatHistoryLine size={14} /> Lịch sử ({chatProps.conversations.length})
              </h2>
              <button
                onClick={chatProps.onNewConversation}
                className="p-2 bg-white text-black rounded-full hover:bg-white/90 transition-transform active:scale-95 shadow-lg shadow-white/5"
                title="Chat mới"
              >
                <FiPlus size={16} />
              </button>
            </div>
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-2.5 pl-9 pr-3 text-[13px] text-white focus:bg-white/[0.06] focus:outline-none placeholder:text-white/20 transition-all focus:border-white/10"
              />
              <div className="absolute left-3 top-3 text-white/20">
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex-1 px-3 pb-4 space-y-4 overflow-y-auto custom-scrollbar">
            {Object.values(groupedConversations).every(
              (g) => g.length === 0
            ) ? (
              <div className="py-12 text-[12px] text-center text-white/20">
                <FiMessageSquare className="w-10 h-10 mx-auto mb-3 opacity-10" />
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            ) : (
              Object.entries(groupedConversations).map(([key, group]) => {
                if (group.length === 0) return null;
                const labels: Record<string, string> = {
                  pinned: "Đã ghim",
                  today: "Hôm nay",
                  yesterday: "Hôm qua",
                  thisWeek: "Tuần này",
                  thisMonth: "Tháng này",
                  older: "Cũ hơn",
                };
                return (
                  <div key={key}>
                    <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase sticky top-0 bg-black/95 backdrop-blur-sm z-10">
                      {labels[key]}
                    </div>
                    <div className="space-y-1.5 px-0.5">
                      {group.map((conv: Conversation) => (
                        <ConversationItem key={conv.id} conv={conv} />
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center flex-1 text-sm text-white/20">
          Chọn "Chat AI" để xem lịch sử
        </div>
      )}

      {/* 4. User Profile */}
      <div className="p-4 mt-auto border-t border-white/5 bg-black">
        <div className="flex items-center gap-3 p-2.5 transition-all cursor-pointer rounded-2xl hover:bg-white/5 group border border-transparent hover:border-white/5">
          <div className="w-9 h-9 rounded-full bg-white/10 p-[1px]">
            <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border border-white/5">
              {avatarSrc ? (
                <img src={avatarSrc} className="object-cover w-full h-full" />
              ) : (
                <span className="text-xs font-bold text-white">{initial}</span>
              )}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-white/90 truncate">
              {displayName}
            </p>
            <p className="text-[10px] text-white/30 truncate font-medium">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-2"
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
