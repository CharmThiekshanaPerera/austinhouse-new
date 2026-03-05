import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, Phone, PhoneOff, CalendarPlus,
  Bot, User, Mic, MicOff, Volume2
} from "lucide-react";
import BookingModal from "./BookingModal";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

type ChatView = "chat" | "calling";

const AUTO_REPLIES: Record<string, string> = {
  hello: "Hello! Welcome to Austin House Beauty & Spa 💫 How can I help you today? I can assist with booking appointments, answering questions about our services, or connecting you with our team.",
  hi: "Hi there! ✨ Welcome to Austin House Beauty & Spa. How may I assist you today?",
  book: "I'd love to help you book an appointment! Click the 📅 button below to open our booking form, or tell me which treatment you're interested in.",
  price: "Our treatments range from affordable to premium:\n\n• Signature Gold Facial — LKR 8,500\n• Laser Hair Removal — from LKR 12,000\n• Luxury Manicure & Pedicure — LKR 4,500\n• Full Body Waxing — LKR 6,000\n• Microdermabrasion — LKR 10,000\n• Relaxation Massage — LKR 7,500\n\nWould you like to book any of these?",
  facial: "Our Signature Gold Facial is our most popular treatment! It includes deep cleansing, exfoliation, a 24K gold mask, and LED therapy. Sessions last 75 minutes. Would you like to book one?",
  laser: "Our Laser Hair Removal uses state-of-the-art technology for safe, effective results. We offer packages for all body areas. Shall I help you book a consultation?",
  hours: "We're open Monday to Saturday, 9:00 AM – 6:00 PM. Closed on Sundays and public holidays. Would you like to schedule a visit?",
  location: "We're located in Colombo, Sri Lanka. You can find us on the Contact page for the full address and map. Would you like directions or to book a visit?",
  call: "You can start a voice call with our AI assistant by clicking the 📞 button below. Our assistant can help with bookings, service info, and more!",
  thanks: "You're welcome! 😊 Is there anything else I can help you with?",
  thank: "You're welcome! 😊 Is there anything else I can help you with?",
};

const DEFAULT_REPLY =
  "Thank you for your message! I'm here to help with bookings, services, pricing, and more. You can also:\n\n📅 **Book an appointment** using the calendar button\n📞 **Call our AI assistant** using the phone button\n\nHow can I assist you?";

function getAutoReply(input: string): string {
  const lower = input.toLowerCase();
  for (const [key, reply] of Object.entries(AUTO_REPLIES)) {
    if (lower.includes(key)) return reply;
  }
  return DEFAULT_REPLY;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<ChatView>("chat");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Welcome to Austin House Beauty & Spa! ✨\n\nI'm your AI assistant. I can help you:\n• Book appointments\n• Answer questions about services & pricing\n• Connect you via voice call\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const callTimerRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const reply = getAutoReply(trimmed);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 1000 + Math.random() * 800);
  }, [input]);

  const startCall = () => {
    setView("calling");
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration((d) => d + 1);
    }, 1000);
  };

  const endCall = () => {
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setView("chat");
    setCallDuration(0);
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content: `Voice call ended (${formatDuration(callDuration)}). How else can I help you?`,
        timestamp: new Date(),
      },
    ]);
  };

  const formatDuration = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <>
      {/* Floating trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-gold-gradient shadow-gold flex items-center justify-center text-primary-foreground"
            aria-label="Open chat"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-6 right-6 z-50 w-[370px] max-w-[calc(100vw-2rem)] h-[540px] max-h-[calc(100vh-4rem)] rounded-2xl overflow-hidden flex flex-col shadow-2xl border border-border bg-card"
          >
            {/* Header */}
            <div className="bg-gold-gradient px-5 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot size={20} className="text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-display text-sm text-primary-foreground font-semibold">
                    Austin House Assistant
                  </h3>
                  <p className="text-[11px] text-primary-foreground/70 font-body">
                    {view === "calling" ? "On a call..." : "Online • Ready to help"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  if (view === "calling") endCall();
                  setIsOpen(false);
                }}
                className="text-primary-foreground/80 hover:text-primary-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {view === "chat" ? (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
                  {messages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <Bot size={14} className="text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-[13px] leading-relaxed font-body whitespace-pre-wrap ${
                          msg.role === "user"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-secondary text-secondary-foreground rounded-bl-md"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {msg.role === "user" && (
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                          <User size={14} className="text-primary" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2 items-start"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Bot size={14} className="text-primary" />
                      </div>
                      <div className="bg-secondary px-4 py-3 rounded-2xl rounded-bl-md flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Action buttons */}
                <div className="px-4 py-2 flex gap-2 border-t border-border shrink-0">
                  <button
                    onClick={() => setBookingOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-body font-semibold tracking-wide bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                  >
                    <CalendarPlus size={14} /> Book Now
                  </button>
                  <button
                    onClick={startCall}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-body font-semibold tracking-wide bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors"
                  >
                    <Phone size={14} /> Call Assistant
                  </button>
                </div>

                {/* Input */}
                <div className="px-4 pb-4 pt-2 shrink-0">
                  <div className="flex gap-2 items-center bg-background border border-border rounded-xl px-3 py-2">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-transparent text-sm font-body text-foreground placeholder:text-muted-foreground focus:outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!input.trim()}
                      className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center text-primary-foreground disabled:opacity-40 transition-opacity hover:opacity-90"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              /* Calling view */
              <div className="flex-1 flex flex-col items-center justify-center gap-6 p-8">
                {/* Animated rings */}
                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute inset-0 w-28 h-28 rounded-full bg-primary/20"
                  />
                  <motion.div
                    animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.1, 0.4] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                    className="absolute inset-0 w-28 h-28 rounded-full bg-primary/15"
                  />
                  <div className="w-28 h-28 rounded-full bg-gold-gradient flex items-center justify-center relative z-10">
                    <Bot size={40} className="text-primary-foreground" />
                  </div>
                </div>

                <div className="text-center">
                  <h4 className="font-display text-lg text-foreground">AI Assistant</h4>
                  <p className="text-muted-foreground font-body text-sm mt-1">
                    {callDuration === 0 ? "Connecting..." : `Call in progress`}
                  </p>
                  <p className="text-primary font-body font-bold text-2xl mt-2 tabular-nums">
                    {formatDuration(callDuration)}
                  </p>
                </div>

                <div className="flex items-center gap-6 mt-4">
                  <button
                    onClick={() => setIsMuted(!isMuted)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                      isMuted
                        ? "bg-destructive/20 text-destructive"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>
                  <button
                    onClick={endCall}
                    className="w-14 h-14 rounded-full bg-destructive flex items-center justify-center text-destructive-foreground hover:opacity-90 transition-opacity"
                  >
                    <PhoneOff size={22} />
                  </button>
                  <button className="w-12 h-12 rounded-full bg-secondary text-foreground flex items-center justify-center hover:bg-secondary/80 transition-colors">
                    <Volume2 size={20} />
                  </button>
                </div>

                <p className="text-xs text-muted-foreground font-body text-center mt-2">
                  🎙️ Demo mode — voice calling will be powered by n8n AI agent
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <BookingModal open={bookingOpen} onOpenChange={setBookingOpen} />
    </>
  );
};

export default ChatBot;
