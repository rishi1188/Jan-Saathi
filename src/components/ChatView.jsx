import React, { useState, useRef, useEffect, useCallback } from "react";
import { Send, Mic, MicOff, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { api } from "../utils/api";
import { t } from "../utils/i18n";

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatText(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "</p><p>")
    .replace(/\n/g, "<br/>")
    .replace(/^(.*)$/, "<p>$1</p>");
}

function MessageBubble({ message }) {
  const isUser = message.role === "user";
  return (
    <div className={`message ${isUser ? "user" : "assistant"}`}>
      <div className="message-avatar">
        {isUser ? "You" : "🙏"}
      </div>
      <div className="message-content">
        <div className="message-bubble">
          {isUser ? (
            <span>{message.content}</span>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: formatText(message.content) }} />
          )}
        </div>
        <div className="message-time">{message.time || formatTime()}</div>
      </div>
    </div>
  );
}

function TypingIndicator({ lang }) {
  return (
    <div className="message assistant">
      <div className="message-avatar">🙏</div>
      <div className="message-content">
        <div className="message-bubble">
          <div className="typing-indicator">
            <div className="typing-dot" />
            <div className="typing-dot" />
            <div className="typing-dot" />
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--gray-400)", fontWeight: 500 }}>
              {t(lang, "typing")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatView({ lang, sessionId, onSessionReset, pendingMessage, onPendingMessageSent }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);
  const quickPrompts = t(lang, "quickPrompts");

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (pendingMessage && sessionId && !isLoading) {
      sendMessage(pendingMessage);
      onPendingMessageSent?.();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingMessage, sessionId]);

  useEffect(() => {
    if (!sessionId) return;
    api.getHistory(sessionId).then((data) => {
      if (data.messages?.length > 0) {
        const clean = data.messages.map((m) => ({
          ...m,
          content: m.content.replace(/\n\n\[System context.*?\]/s, ""),
          time: formatTime(),
        }));
        setMessages(clean);
      }
    }).catch(() => {});
  }, [sessionId]);

  const sendMessage = useCallback(async (text) => {
    const msg = (text || input).trim();
    if (!msg || isLoading) return;
    setInput("");
    setError(null);

    const userMsg = { role: "user", content: msg, time: formatTime() };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const data = await api.sendMessage(msg, sessionId, lang);
      setMessages((prev) => [...prev, { role: "assistant", content: data.message, time: formatTime() }]);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, isLoading, sessionId, lang]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setError("Voice input not supported. Try Chrome."); return; }
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    const langMap = { hi: "hi-IN", te: "te-IN", ta: "ta-IN", en: "en-IN" };
    recognition.lang = langMap[lang] || "en-IN";
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => { setIsListening(false); setError("Voice input failed. Try again."); };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
      setTimeout(() => sendMessage(transcript), 200);
    };
    recognition.start();
  };

  const handleClear = async () => {
    if (!window.confirm("Clear this conversation?")) return;
    try { await api.clearSession(sessionId); } catch {}
    setMessages([]);
    setError(null);
    onSessionReset?.();
  };

  const isWelcome = messages.length === 0 && !isLoading;

  const features = [
    { icon: "🏛️", label: "10+ Schemes" },
    { icon: "🌐", label: "4 Languages" },
    { icon: "🎯", label: "Eligibility Check" },
    { icon: "🎤", label: "Voice Input" },
  ];

  return (
    <>
      {/* Header */}
      <div className="chat-header">
        <div className="chat-header-left">
          <div className="header-avatar">🙏</div>
          <div>
            <div className="chat-header-title">{t(lang, "appName")}</div>
            <div className="chat-header-subtitle">
              <div className="online-dot" />
              Online · Ready to help
            </div>
          </div>
        </div>
        <div className="chat-header-actions">
          {messages.length > 0 && (
            <button className="icon-btn" onClick={handleClear} title="Clear chat">
              <Trash2 size={15} />
            </button>
          )}
          <button className="icon-btn" onClick={() => window.location.reload()} title="Refresh">
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="messages-area">
        {isWelcome ? (
          <div className="welcome">
            <div className="welcome-avatar">🙏</div>
            <h1>
              {t(lang, "welcomeTitle").includes("Jan Saathi") ? (
                <>Namaste! I'm <span>Jan Saathi</span> 🙏</>
              ) : t(lang, "welcomeTitle")}
            </h1>
            <p>{t(lang, "welcomeSubtitle")}</p>

            <div className="welcome-features">
              {features.map((f) => (
                <div className="feature-pill" key={f.label}>
                  <span>{f.icon}</span> {f.label}
                </div>
              ))}
            </div>

            <div className="quick-prompts">
              {Array.isArray(quickPrompts) && quickPrompts.map((prompt, i) => (
                <button key={i} className="quick-prompt-btn" onClick={() => sendMessage(prompt)}>
                  <Sparkles size={12} style={{ marginRight: 6, verticalAlign: "middle", color: "var(--indigo)" }} />
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => <MessageBubble key={i} message={msg} />)}
            {isLoading && <TypingIndicator lang={lang} />}
            {error && (
              <div className="error-banner">
                ⚠️ {error}
                <button onClick={() => setError(null)}
                  style={{ marginLeft: "auto", background: "none", color: "#DC2626", fontSize: 18, lineHeight: 1 }}>
                  ×
                </button>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="input-area">
        <div className="input-row">
          <textarea
            ref={inputRef}
            className="message-input"
            placeholder={t(lang, "placeholder")}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={isLoading}
          />
          <button className={`voice-btn ${isListening ? "listening" : ""}`} onClick={handleVoice} title="Voice input">
            {isListening ? <MicOff size={17} /> : <Mic size={17} />}
          </button>
          <button className="send-btn" onClick={() => sendMessage()} disabled={!input.trim() || isLoading}>
            <Send size={16} />
          </button>
        </div>
        <div className="input-hint">Press Enter to send · Shift+Enter for new line</div>
      </div>
    </>
  );
}
