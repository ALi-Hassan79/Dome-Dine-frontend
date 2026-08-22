"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { sendChatMessage, type ChatMessage } from "@/lib/chatbot";
import { ApiRequestError } from "@/lib/api";
import { cn } from "@/lib/utils";

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hey! I'm the Dorm & Dine assistant. Ask me anything about finding a hostel or mess, saving listings, reviews, or listing your own place.",
};

export function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      // Send prior history (excluding the canned greeting) so the bot has
      // context for follow-up questions.
      const history = nextMessages.slice(1, -1);
      const { reply } = await sendChatMessage(trimmed, history);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setError(err instanceof ApiRequestError ? err.message : "Couldn't reach the assistant.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(28rem,70dvh)] w-[22rem] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-lg bg-paper text-ink shadow-2xl shadow-black/40">
          {/* header */}
          <div className="flex items-center justify-between bg-board px-4 py-3 text-chalk">
            <div>
              <p className="font-display text-xl leading-none">Dorm &amp; Dine Assistant</p>
              <p className="mt-0.5 text-[11px] text-chalk/60">Ask about listings, reviews, and more</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 text-chalk/70 hover:bg-white/10 hover:text-chalk transition"
            >
              <X size={18} />
            </button>
          </div>

          {/* messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-3 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] rounded-lg px-3 py-2 text-sm leading-snug whitespace-pre-wrap",
                    m.role === "user"
                      ? "bg-board text-chalk rounded-br-sm"
                      : "bg-paper-dim text-ink rounded-bl-sm"
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-lg rounded-bl-sm bg-paper-dim px-3 py-2 text-ink/60">
                  <Loader2 size={14} className="animate-spin" />
                  <span className="text-xs">Typing...</span>
                </div>
              </div>
            )}
            {error && <p className="px-1 text-xs text-marker">{error}</p>}
          </div>

          {/* input */}
          <div className="flex items-center gap-2 border-t border-dashed border-ink/15 p-2.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              className="flex-1 rounded-sm border border-ink/15 bg-white/60 px-3 py-2 text-sm placeholder:text-ink/40 focus:outline-none focus:ring-2 focus:ring-yellow"
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-board text-chalk transition hover:brightness-110 disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}

      {/* floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat assistant" : "Open chat assistant"}
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-marker text-chalk shadow-lg shadow-black/40 transition hover:scale-105 active:scale-95"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  );
}