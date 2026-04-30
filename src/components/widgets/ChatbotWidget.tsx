"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import type { ChatMessage } from "@/types";

const CANNED_RESPONSES: Record<string, string> = {
  "order status":
    "To check your order status, please visit My Account → Orders, or provide your order ID and we'll look it up for you.",
  shipping:
    "We ship across Pakistan! Standard delivery takes 3-5 business days. Express delivery (1-2 days) is also available at checkout.",
  returns:
    "We offer hassle-free returns within 7 days of delivery. Items must be unworn and in original packaging. Visit our Returns page for more details.",
  sizing:
    "Our size guide is available on every product page. We recommend checking it before ordering. Need help? Share your measurements and we'll suggest the right size.",
  payment:
    "We accept Cash on Delivery (COD), bank transfer, and online payments via Stripe.",
  contact:
    "You can reach us at +92 306 1536925 (WhatsApp) or email hello@waqarstore.com. We're available Mon–Sat, 10am–8pm.",
};

const QUICK_REPLIES = [
  "Order status",
  "Shipping",
  "Returns",
  "Sizing",
  "Payment",
  "Contact",
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  content:
    "👋 Hi! Welcome to Waqar Store. How can I help you today? You can ask about orders, shipping, returns, or sizing.",
  timestamp: new Date(),
};

function getBotResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const [keyword, response] of Object.entries(CANNED_RESPONSES)) {
    if (lower.includes(keyword)) return response;
  }
  return "I'm not sure about that. Please contact us directly at +92 306 1536925 on WhatsApp or email hello@waqarstore.com and we'll help you right away!";
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      role: "assistant",
      content: getBotResponse(text),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
            style={{ maxHeight: "min(520px, calc(100vh - 120px))" }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 bg-[#0a0a0a] px-4 py-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#c9a84c]">
                <Bot size={16} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-white">Waqar Store Support</p>
                <p className="text-xs text-gray-400">Typically replies instantly</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#f9f9f9]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex",
                    msg.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                      msg.role === "user"
                        ? "bg-[#0a0a0a] text-white rounded-br-sm"
                        : "bg-white text-[#0a0a0a] shadow-sm border border-gray-100 rounded-bl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick replies */}
            <div className="flex flex-wrap gap-2 px-4 py-2 bg-white border-t border-gray-100">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:border-[#0a0a0a] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0a0a] text-white disabled:opacity-40 hover:bg-[#c9a84c] transition-colors"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "flex h-14 w-14 items-center justify-center rounded-full shadow-lg",
          "transition-all duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
          isOpen
            ? "bg-[#0a0a0a] text-white focus-visible:ring-[#0a0a0a]"
            : "bg-[#c9a84c] text-white focus-visible:ring-[#c9a84c]"
        )}
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
