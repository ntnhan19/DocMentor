import React, { useState, useMemo, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  FiCopy,
  FiThumbsUp,
  FiThumbsDown,
  FiFile,
  FiBookOpen,
  FiEdit3,
  FiCheck,
  FiExternalLink,
  FiUser,
  FiCpu,
} from "react-icons/fi";

// --- TYPES ---
interface SourceReference {
  documentId: string;
  documentTitle: string;
  pageNumber: number | null;
  similarityScore?: number;
  text?: string; // ✅ Bổ sung snippet cho tooltip
}

interface ChatMessage {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: string;
  status?: "sending" | "sent" | "error" | "loading";
  attachment?: { fileName: string; fileSize: number; fileType: string };
  attachedDocuments?: Array<{ id: string; title: string }>;
  sources?: SourceReference[];
}

interface MessageBubbleProps {
  message: ChatMessage;
  onEditMessage?: (messageId: string, newText: string) => void;
}

// 1. Citation Badge
const CitationBadge: React.FC<{
  citation: string;
  sources: SourceReference[];
  isUser: boolean;
}> = ({ citation, sources, isUser }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <span
      className="relative inline-block align-baseline mx-0.5"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <sup
        className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full cursor-help transition-all ${
          isUser
            ? "bg-white/30 text-white"
            : "bg-primary text-white hover:bg-primary/80"
        }`}
      >
        {citation}
      </sup>
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 bg-[#0f0e1a] border border-gray-700 shadow-2xl rounded-xl z-[9999] animate-fade-in">
          <div className="pb-1 mb-2 text-xs font-bold tracking-wider text-gray-300 uppercase border-b border-gray-700">
            Nguồn tham khảo
          </div>
          <div className="space-y-2 overflow-y-auto max-h-48 custom-scrollbar">
            {sources.length > 0 ? (
              sources.map((source, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 p-2 rounded hover:bg-white/5 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-start gap-2">
                    <span className="flex-shrink-0 w-4 h-4 bg-primary text-white rounded-full flex items-center justify-center text-[9px] mt-0.5 font-bold">
                      {sources.length === 1 ? citation : (idx + 1)}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-200 line-clamp-1">
                        {source.documentTitle || "Tài liệu"}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-500 bg-white/5 px-1.5 rounded">
                          {source.pageNumber ? `Trang ${source.pageNumber}` : "Toàn văn"}
                        </span>
                        {source.similarityScore && (
                          <span className="text-[10px] text-green-500">
                            {Math.round(source.similarityScore * 100)}% khớp
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* ✅ HIỂN THỊ SNIPPET TRONG TOOLTIP */}
                  {source.text && (
                    <p className="text-[11px] text-gray-400 italic leading-relaxed mt-1 border-l-2 border-primary/30 pl-2">
                      "{source.text.length > 150 ? source.text.substring(0, 150) + "..." : source.text}"
                    </p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-xs italic text-center text-gray-500">
                Chi tiết nguồn chưa được lập chỉ mục
              </p>
            )}
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#0f0e1a]"></div>
        </div>
      )}
    </span>
  );
};

// 2. Component xử lý text để inject Citation (Đã tối ưu với React.memo)
const CitationTextProcessor = React.memo(
  ({
    text,
    isUser,
    sources,
  }: {
    text: string;
    isUser: boolean;
    sources: SourceReference[];
  }) => {
    const regex = /\[(\d+(?:,\s*\d+)*)\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex)
        parts.push(text.substring(lastIndex, match.index));
      const citationStr = match[1];
      const nums = citationStr.split(",").map((n) => parseInt(n.trim()));
      const relevantSources = nums.map((n) => sources[n - 1]).filter(Boolean);

      parts.push(
        <CitationBadge
          key={match.index}
          citation={citationStr}
          sources={relevantSources}
          isUser={isUser}
        />
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) parts.push(text.substring(lastIndex));
    return <>{parts}</>;
  }
);

// Helper để áp dụng CitationProcessor cho children
// ✅ FIX: Recursive function to handle nested elements (like bold, italic inside list items)
const renderWithCitations = (
  children: React.ReactNode,
  isUser: boolean,
  sources: SourceReference[]
): React.ReactNode => {
  return React.Children.map(children, (child) => {
    if (typeof child === "string") {
      return (
        <CitationTextProcessor text={child} isUser={isUser} sources={sources} />
      );
    }

    // If it's a React element (e.g., <strong>, <em>), process its children recursively
    if (React.isValidElement(child)) {
      const childElement = child as React.ReactElement<any>;
      if (childElement.props && childElement.props.children) {
        return React.cloneElement(
          childElement,
          {},
          renderWithCitations(childElement.props.children, isUser, sources)
        );
      }
    }

    return child;
  });
};

// 3. MAIN COMPONENT
const MessageBubble = React.memo(
  ({ message, onEditMessage }: MessageBubbleProps) => {
    const isUser = message.sender === "user";
    const isLoading = message.status === "loading";
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedText, setEditedText] = useState(message.text);
    const [typingText, setTypingText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const hasStartedTyping = useRef(false);

    // ✅ Hiệu ứng Typewriter: CHỈ chạy cho tin nhắn AI vừa mới gửi xong
    useEffect(() => {
      const isNewAiMessage = !isUser && !isLoading && message.status === "sent" && !hasStartedTyping.current;
      
      if (isNewAiMessage && message.text) {
        setIsTyping(true);
        hasStartedTyping.current = true;

        const words = message.text.split(" ");
        let currentText = "";
        let i = 0;

        const interval = setInterval(() => {
          if (i < words.length) {
            currentText += (i === 0 ? "" : " ") + words[i];
            setTypingText(currentText);
            i++;
          } else {
            setIsTyping(false);
            clearInterval(interval);
          }
        }, 15);

        return () => clearInterval(interval);
      } else {
        // Nếu là tin nhắn User, tin nhắn đang Load, hoặc tin nhắn CŨ từ lịch sử
        setTypingText(message.text || "");
        setIsTyping(false);
        // Đánh dấu đã "gõ" xong để không chạy lại hiệu ứng khi re-render
        if (message.text) hasStartedTyping.current = true;
      }
    }, [isUser, isLoading, message.text, message.status]);

    const displayText = useMemo(() => {
      const textToProcess = isTyping ? typingText : message.text;
      return textToProcess
        .replace(/\[(?:Nguồn|Source)\s*\d+:\s*.*?\]/gi, "")
        .trim();
    }, [isTyping, typingText, message.text]);
    const activeSources = useMemo(
      () => message.sources || [],
      [message.sources]
    );

    const handleCopy = () => {
      navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };

    const markdownComponents = useMemo(
      () => ({
        // ✅ Apply citation rendering to paragraph
        p: ({ children }: any) => (
          <div
            className={`mb-3 leading-relaxed ${isUser ? "text-white" : "text-gray-200"}`}
          >
            {renderWithCitations(children, isUser, activeSources)}
          </div>
        ),

        // ✅ FIX: Apply citation rendering to List Items (li)
        li: ({ children }: any) => (
          <li className="pl-1 marker:text-gray-500">
            {renderWithCitations(children, isUser, activeSources)}
          </li>
        ),

        // ✅ FIX: Apply citation rendering to Table Cells (td)
        td: ({ children }: any) => (
          <td className="px-4 py-2.5 text-gray-300">
            {renderWithCitations(children, isUser, activeSources)}
          </td>
        ),

        // ✅ FIX: Apply citation rendering to Table Headers (th)
        th: ({ children }: any) => (
          <th className="px-4 py-3 font-semibold text-left text-white border-b border-gray-700 bg-gray-800/50">
            {renderWithCitations(children, isUser, activeSources)}
          </th>
        ),

        // ✅ FIX: Apply citation rendering to Headings (h1-h3) if citations appear there
        h1: ({ children }: any) => (
          <h1 className="mt-4 mb-2 text-xl font-bold text-white">
            {renderWithCitations(children, isUser, activeSources)}
          </h1>
        ),
        h2: ({ children }: any) => (
          <h2 className="mt-3 mb-2 text-lg font-bold text-white">
            {renderWithCitations(children, isUser, activeSources)}
          </h2>
        ),
        h3: ({ children }: any) => (
          <h3 className="mt-3 mb-1 text-base font-bold text-secondary">
            {renderWithCitations(children, isUser, activeSources)}
          </h3>
        ),

        // Standard block styling
        ul: ({ children }: any) => (
          <ul className="mb-3 ml-5 space-y-1 text-gray-200 list-disc list-outside">
            {children}
          </ul>
        ),
        ol: ({ children }: any) => (
          <ol className="mb-3 ml-5 space-y-1 text-gray-200 list-decimal list-outside">
            {children}
          </ol>
        ),
        table: ({ children }: any) => (
          <div className="my-4 overflow-hidden rounded-lg border border-gray-700 bg-[#151320]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">{children}</table>
            </div>
          </div>
        ),
        thead: ({ children }: any) => (
          <thead className="font-semibold text-white bg-gray-800/50">
            {children}
          </thead>
        ),
        tbody: ({ children }: any) => (
          <tbody className="divide-y divide-gray-700/50">{children}</tbody>
        ),
        tr: ({ children }: any) => (
          <tr className="transition-colors hover:bg-white/5">{children}</tr>
        ),
        blockquote: ({ children }: any) => (
          <blockquote className="pl-4 my-2 italic text-gray-400 border-l-4 border-primary">
            {children}
          </blockquote>
        ),
        code: ({ inline, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          return !inline ? (
            <div className="my-2 rounded-lg overflow-hidden border border-gray-700 bg-[#0d0a19]">
              <div className="flex justify-between px-3 py-1 text-xs text-gray-400 bg-gray-800 border-b border-gray-700">
                <span>{match?.[1] || "code"}</span>
              </div>
              <pre className="p-3 overflow-x-auto font-mono text-sm text-gray-300">
                <code className={className} {...props}>
                  {children}
                </code>
              </pre>
            </div>
          ) : (
            <code
              className="bg-black/30 px-1.5 py-0.5 rounded font-mono text-sm text-secondary"
              {...props}
            >
              {children}
            </code>
          );
        },
      }),
      [isUser, activeSources]
    );

    return (
      <div
        className={`flex w-full gap-4 ${isUser ? "justify-end" : "justify-start"} group mb-6 animate-fade-in`}
      >
        {!isUser && (
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 rounded-full shadow-lg bg-gradient-to-br from-indigo-500 to-purple-600">
            <FiCpu
              className={`w-4 h-4 text-white ${isLoading ? "animate-pulse" : ""}`}
            />
          </div>
        )}

        <div
          className={`flex flex-col max-w-[85%] lg:max-w-[75%] ${isUser ? "items-end" : "items-start"}`}
        >
          <span className="text-[10px] text-gray-500 mb-1 px-1 opacity-70">
            {isUser ? "Bạn" : "DocMentor AI"} •{" "}
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          <div
            className={`relative px-5 py-4 shadow-md text-sm transition-all ${
              isUser
                ? "bg-primary text-white rounded-2xl rounded-tr-sm"
                : "bg-[#1A162D] border border-white/10 text-gray-200 rounded-2xl rounded-tl-sm"
            }`}
          >
            {isLoading ? (
              <div className="flex gap-1.5 items-center h-5 px-1">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            ) : (
              <>
                {isUser &&
                  (message.attachment || message.attachedDocuments) && (
                    <div className="mb-3 space-y-2">
                      {message.attachment && (
                        <div className="flex items-center gap-2 p-2 text-xs border rounded bg-white/10 border-white/10">
                          <FiFile /> {message.attachment.fileName}
                        </div>
                      )}
                      {message.attachedDocuments?.map((doc, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 text-xs border rounded bg-white/10 border-white/10"
                        >
                          <FiBookOpen /> {doc.title}
                        </div>
                      ))}
                    </div>
                  )}

                {isEditing ? (
                  <div className="min-w-[300px]">
                    <textarea
                      value={editedText}
                      onChange={(e) => setEditedText(e.target.value)}
                      className="w-full p-2 text-white border rounded bg-black/30 border-white/20 focus:outline-none"
                      rows={4}
                    />
                    <div className="flex justify-end gap-2 mt-2">
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-3 py-1 text-xs rounded hover:bg-white/10"
                      >
                        Hủy
                      </button>
                      <button
                        onClick={() => {
                          onEditMessage?.(message.id, editedText);
                          setIsEditing(false);
                        }}
                        className="px-3 py-1 text-xs font-bold bg-white rounded text-primary"
                      >
                        Lưu
                      </button>
                    </div>
                  </div>
                ) : (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={markdownComponents}
                  >
                    {displayText}
                  </ReactMarkdown>
                )}

                {/* Sources Footer - Optimized Grouping */}
                {!isUser && activeSources.length > 0 && (
                  <div className="pt-3 mt-4 border-t border-white/10">
                    <div className="flex items-center gap-1 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                      <FiBookOpen size={10} /> {activeSources.length} Nguồn tham khảo
                    </div>
                    <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                      {/* ✅ GỘP NGUỒN TRÙNG LẶP */}
                      {Object.values(activeSources.reduce((acc: any, src, idx) => {
                        const key = src.documentId || src.documentTitle;
                        if (!acc[key]) {
                          acc[key] = { ...src, indices: [idx + 1], pages: new Set() };
                        } else {
                          acc[key].indices.push(idx + 1);
                        }
                        if (src.pageNumber) acc[key].pages.add(src.pageNumber);
                        return acc;
                      }, {})).map((group: any, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 p-2 rounded bg-black/20 hover:bg-black/40 border border-transparent hover:border-white/10 transition-colors cursor-pointer group"
                        >
                          <div className="flex -space-x-1 overflow-hidden">
                            {group.indices.map((idx: number) => (
                              <span key={idx} className="w-5 h-5 bg-gray-700 group-hover:bg-primary group-hover:text-white transition-colors rounded-full flex items-center justify-center text-[9px] font-bold text-gray-300 border border-[#1A162D]">
                                {idx}
                              </span>
                            ))}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block text-[11px] text-gray-400 truncate group-hover:text-gray-200">
                              {group.documentTitle || "Tài liệu"}
                            </span>
                            {group.pages.size > 0 && (
                              <span className="text-[9px] text-gray-600">
                                Trang: {Array.from(group.pages).join(", ")}
                              </span>
                            )}
                          </div>
                          <FiExternalLink
                            size={10}
                            className="text-gray-600 group-hover:text-gray-400"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Actions */}
          {!isLoading && (
            <div className="flex items-center gap-1 px-1 mt-1 transition-opacity opacity-0 group-hover:opacity-100">
              <button
                onClick={handleCopy}
                className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors"
                title="Sao chép"
              >
                {copied ? <FiCheck size={14} /> : <FiCopy size={14} />}
              </button>
              {!isUser && (
                <>
                  <button className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-green-400">
                    <FiThumbsUp size={14} />
                  </button>
                  <button className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-red-400">
                    <FiThumbsDown size={14} />
                  </button>
                </>
              )}
              {isUser && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 hover:bg-white/10 rounded text-gray-500 hover:text-white"
                >
                  <FiEdit3 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
        {isUser && (
          <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 mt-1 bg-gray-700 rounded-full">
            <FiUser className="text-gray-300" />
          </div>
        )}
      </div>
    );
  }
);

export default MessageBubble;
