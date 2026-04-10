import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

// ── Quick Bible verses for the verse picker ────────────────
const QUICK_VERSES = [
  { ref: "Philippians 4:6",   text: "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God." },
  { ref: "James 5:16",        text: "The prayer of a righteous person is powerful and effective." },
  { ref: "Matthew 18:20",     text: "For where two or three gather in my name, there am I with them." },
  { ref: "Jeremiah 29:11",    text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you." },
  { ref: "Psalm 34:17",       text: "The righteous cry out, and the Lord hears them; he delivers them from all their troubles." },
  { ref: "Romans 8:28",       text: "And we know that in all things God works for the good of those who love him." },
  { ref: "Isaiah 41:10",      text: "Do not fear, for I am with you; do not be dismayed, for I am your God." },
  { ref: "1 Peter 5:7",       text: "Cast all your anxiety on him because he cares for you." },
];

// ── Reaction options ───────────────────────────────────────
const REACTIONS = ["🙏", "❤️", "🔥", "✝️", "💪", "🕊️", "⚡", "🙌"];

// ── Single message bubble ──────────────────────────────────
function MessageBubble({ message, isOwn }) {
  const isSystem   = message.type === "system";
  const isReaction = message.message_type === "reaction";
  const isVerse    = message.message_type === "verse";

  // System message — centered
  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-[11px] text-[#71717A] bg-[#F4F4F5]
                         px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  // Reaction — large centered emoji
  if (isReaction) {
    return (
      <div className={`flex ${isOwn ? "justify-end" : "justify-start"}
                       my-1`}>
        <div className="text-center">
          <span className="text-3xl">{message.content}</span>
          {!isOwn && (
            <p className="text-[10px] text-[#A1A1AA] mt-0.5">
              {message.author_name}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"}
                     mb-3 gap-2`}>
      {/* Avatar — only for others */}
      {!isOwn && (
        <div className="w-6 h-6 rounded-full bg-[#EDE9FE] flex-shrink-0
                        flex items-center justify-center text-[#7C3AED]
                        text-[10px] font-semibold mt-auto">
          {message.author_name?.[0]?.toUpperCase() ?? "?"}
        </div>
      )}

      <div className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"}
                       flex flex-col gap-1`}>
        {/* Author name — only for others */}
        {!isOwn && (
          <span className="text-[10px] text-[#A1A1AA] ml-1">
            {message.author_name}
          </span>
        )}

        {/* Bubble */}
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? "bg-[#7C3AED] text-white rounded-br-sm"
            : "bg-[#F4F4F5] text-[#18181B] rounded-bl-sm"}
          ${isVerse ? "border-l-2 border-[#7C3AED] italic" : ""}`}>

          {/* Verse reference */}
          {isVerse && (
            <p className={`text-[10px] font-semibold uppercase
                           tracking-wider mb-1 not-italic
                           ${isOwn ? "text-white/70" : "text-[#7C3AED]"}`}>
              {message.verse_ref ?? "Bible Verse"}
            </p>
          )}

          {message.content}
        </div>

        {/* Timestamp */}
        <span className="text-[10px] text-[#A1A1AA] mx-1">
          {new Date(message.created_at).toLocaleTimeString("en-GB", {
            hour:   "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

// ── Chat Panel ─────────────────────────────────────────────
function ChatPanel({ prayer, onClose }) {
  const { user }                          = useAuth();
  const [messages, setMessages]           = useState([]);
  const [input, setInput]                 = useState("");
  const [loading, setLoading]             = useState(true);
  const [connected, setConnected]         = useState(false);
  const [connError, setConnError]         = useState("");
  const [showVerses, setShowVerses]       = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const wsRef                             = useRef(null);
  const bottomRef                         = useRef(null);
  const inputRef                          = useRef(null);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Load history + open WebSocket ──
  useEffect(() => {
  if (!prayer?.id || !user) return;

  // ✅ Get token (adjust based on your setup)
  const token =
    localStorage.getItem("token") ||
    user?.access_token ||
    user?.token;

  if (!token) {
    console.error("No token found for WebSocket connection");
    setConnError("Authentication error. Please log in again.");
    return;
  }

  // ── Load message history ──
  api.get(`/prayers/${prayer.id}/messages`)
    .then((res) => setMessages(res.data))
    .catch((err) => console.error("Failed to load messages:", err))
    .finally(() => setLoading(false));

  // ── Build correct WebSocket URL ──
  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  const API_BASE = "localhost:8000"; 
  const wsUrl = `${wsProtocol}//${API_BASE}/api/prayers/${prayer.id}/ws?token=${token}`;

  const ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    setConnected(true);
    setConnError("");
    console.log("Chat connected ✓");
  };

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    // ✅ Prevent duplicate messages
    setMessages((prev) => {
      if (data.id && prev.find((m) => m.id === data.id)) {
        return prev;
      }
      return [...prev, data];
    });
  };

  ws.onclose = (event) => {
    setConnected(false);

    if (event.code === 4003) {
      setConnError("Access denied. You must intercede for this prayer to chat.");
    } else if (event.code === 4001) {
      setConnError("Session expired. Please sign in again.");
    } else if (event.code !== 1000) {
      setConnError("Connection lost. Please close and reopen the chat.");
    }
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
    setConnected(false);
    setConnError("Connection error. Please try again.");
  };

  wsRef.current = ws;

  // ── Cleanup ──
  return () => {
    if (wsRef.current) {
      wsRef.current.close();
    }
  };
}, [prayer?.id]);

  // ── Send text message ──
  const sendMessage = () => {
    if (!input.trim() || !wsRef.current || !connected) return;
    wsRef.current.send(JSON.stringify({
      content:      input.trim(),
      message_type: "text",
    }));
    setInput("");
    inputRef.current?.focus();
  };

  // ── Send Bible verse ──
  const sendVerse = (verse) => {
    if (!wsRef.current || !connected) return;
    wsRef.current.send(JSON.stringify({
      content:      `${verse.ref} — "${verse.text}"`,
      message_type: "verse",
      verse_ref:    verse.ref,
    }));
    setShowVerses(false);
    inputRef.current?.focus();
  };

  // ── Send reaction ──
  const sendReaction = (emoji) => {
    if (!wsRef.current || !connected) return;
    wsRef.current.send(JSON.stringify({
      content:      emoji,
      message_type: "reaction",
    }));
    setShowReactions(false);
  };

  // ── Handle Enter key ──
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />

      {/* ── Slide-in panel ── */}
      <div className="fixed top-0 right-0 h-full w-full sm:w-[420px]
                      bg-white z-50 flex flex-col shadow-2xl
                      animate-[slideIn_0.25s_ease_forwards]">

        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 px-5 py-4
                        border-b border-[#E4E4E7] flex-shrink-0">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h2
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-lg font-semibold text-[#18181B] truncate"
              >
                {prayer.title}
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              {/* Connection status dot */}
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                ${connected ? "bg-green-400" : "bg-[#A1A1AA]"}`} />
              <p className="text-xs text-[#A1A1AA]">
                {connected ? "Connected" : "Connecting..."}
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="text-[#A1A1AA] hover:text-[#18181B]
                       transition-colors flex-shrink-0 p-1"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Prayer context bar ── */}
        <div className="px-5 py-3 bg-[#FAFAFA] border-b border-[#E4E4E7]
                        flex-shrink-0">
          <p className="text-xs text-[#52525B] leading-relaxed line-clamp-2">
            {prayer.body}
          </p>
          <p className="text-[11px] text-[#A1A1AA] mt-1">
            {prayer.prayer_count ?? 0} believer{prayer.prayer_count !== 1
              ? "s" : ""} interceding · {prayer.category}
          </p>
        </div>

        {/* ── Messages area ── */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {connError ? (
            <div className="flex flex-col items-center justify-center h-full
                            text-center px-6">
                <span className="text-3xl mb-3">⚠️</span>
                <p className="text-sm font-semibold text-[#18181B] mb-1">
                Unable to Connect
                </p>
                <p className="text-xs text-[#A1A1AA] leading-relaxed">
                {connError}
                </p>
            </div>
            ) : loading ? (
            <div className="flex items-center justify-center h-full">
              <svg className="w-5 h-5 animate-spin text-[#7C3AED]"
                fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center
                            h-full text-center px-6">
              <span className="text-4xl mb-3">🙏</span>
              <p style={{ fontFamily: "'Cormorant Garamond', serif" }}
                className="text-lg font-semibold text-[#18181B] mb-1">
                Start Praying Together
              </p>
              <p className="text-xs text-[#A1A1AA] leading-relaxed">
                Share encouragement, Bible verses or prayer reactions
                with the community standing with this request.
              </p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageBubble
                key={msg.id ?? i}
                message={msg}
                isOwn={msg.user_id === user?.id}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Verse picker ── */}
        {showVerses && (
          <div className="flex-shrink-0 border-t border-[#E4E4E7]
                          bg-white max-h-48 overflow-y-auto">
            <p className="text-[10px] font-semibold text-[#A1A1AA]
                          uppercase tracking-wider px-4 pt-3 pb-2">
              Quick Bible Verses
            </p>
            {QUICK_VERSES.map((verse) => (
              <button
                key={verse.ref}
                onClick={() => sendVerse(verse)}
                className="w-full text-left px-4 py-2.5 hover:bg-[#FAFAFA]
                           transition-colors border-b border-[#E4E4E7]
                           last:border-0"
              >
                <p className="text-xs font-semibold text-[#7C3AED] mb-0.5">
                  {verse.ref}
                </p>
                <p className="text-xs text-[#52525B] leading-relaxed
                               line-clamp-2">
                  {verse.text}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* ── Reaction picker ── */}
        {showReactions && (
          <div className="flex-shrink-0 border-t border-[#E4E4E7]
                          bg-white px-4 py-3">
            <p className="text-[10px] font-semibold text-[#A1A1AA]
                          uppercase tracking-wider mb-2">
              Prayer Reactions
            </p>
            <div className="flex flex-wrap gap-2">
              {REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => sendReaction(emoji)}
                  className="text-2xl hover:scale-125 transition-transform
                             duration-150 p-1 rounded-lg
                             hover:bg-[#F4F4F5]"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Input area ── */}
        <div className="flex-shrink-0 border-t border-[#E4E4E7] px-4 py-3
                        bg-white">

          {/* Toolbar — verse + reaction buttons */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => {
                setShowVerses(!showVerses);
                setShowReactions(false);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium
                          px-2.5 py-1.5 rounded-lg transition-colors
                          ${showVerses
                            ? "bg-[#EDE9FE] text-[#7C3AED]"
                            : "text-[#52525B] hover:bg-[#F4F4F5]"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168
                     5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477
                     4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0
                     3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5
                     18c-1.746 0-3.332.477-4.5 1.253"/>
              </svg>
              Bible Verse
            </button>

            <button
              onClick={() => {
                setShowReactions(!showReactions);
                setShowVerses(false);
              }}
              className={`flex items-center gap-1.5 text-xs font-medium
                          px-2.5 py-1.5 rounded-lg transition-colors
                          ${showReactions
                            ? "bg-[#EDE9FE] text-[#7C3AED]"
                            : "text-[#52525B] hover:bg-[#F4F4F5]"}`}
            >
              🙏 Reactions
            </button>

            {/* Connection indicator */}
            <div className="ml-auto flex items-center gap-1">
              <div className={`w-1.5 h-1.5 rounded-full
                ${connected ? "bg-green-400" : "bg-red-400"}`} />
              <span className="text-[10px] text-[#A1A1AA]">
                {connected ? "Live" : "Offline"}
              </span>
            </div>
          </div>

          {/* Text input row */}
          <div className="flex items-end gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message or prayer..."
              rows={1}
              className="flex-1 border border-[#E4E4E7] rounded-xl px-3
                         py-2.5 text-sm text-[#18181B] resize-none
                         placeholder:text-[#A1A1AA] leading-relaxed
                         max-h-24 overflow-y-auto"
              style={{ height: "auto" }}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 96) + "px";
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !connected}
              className="bg-[#7C3AED] hover:bg-[#5B21B6] text-white
                         p-2.5 rounded-xl transition-colors duration-200
                         disabled:opacity-40 disabled:cursor-not-allowed
                         flex-shrink-0"
            >
              <svg className="w-4 h-4 rotate-90" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>

          <p className="text-[10px] text-[#A1A1AA] mt-1.5 text-center">
            Enter to send · Shift+Enter for new line
          </p>
        </div>

      </div>
    </>
  );
}

export default ChatPanel;