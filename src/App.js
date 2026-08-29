import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import ChatView from "./components/ChatView";
import SchemesView from "./components/SchemesView";
import EligibilityView from "./components/EligibilityView";
import { api } from "./utils/api";

function App() {
  const [lang, setLang] = useState(() => localStorage.getItem("js_lang") || "en");
  const [activeView, setActiveView] = useState("chat");
  const [sessionId, setSessionId] = useState(null);
  const [pendingChatMessage, setPendingChatMessage] = useState(null);

  // Persist language
  useEffect(() => {
    localStorage.setItem("js_lang", lang);
  }, [lang]);

  // Get or create session
  useEffect(() => {
    const stored = sessionStorage.getItem("js_session");
    if (stored) {
      setSessionId(stored);
    } else {
      api.getSession()
        .then(({ sessionId }) => {
          sessionStorage.setItem("js_session", sessionId);
          setSessionId(sessionId);
        })
        .catch(() => {
          // Fallback: generate client-side UUID
          const id = "local-" + Math.random().toString(36).slice(2);
          sessionStorage.setItem("js_session", id);
          setSessionId(id);
        });
    }
  }, []);

  const handleSessionReset = useCallback(() => {
    const id = "local-" + Math.random().toString(36).slice(2);
    sessionStorage.setItem("js_session", id);
    setSessionId(id);
  }, []);

  // Navigate to chat and pre-fill message from eligibility flow
  const handleAskAbout = useCallback((schemeOrMessage) => {
    const msg = typeof schemeOrMessage === "string"
      ? schemeOrMessage
      : `Tell me more about ${schemeOrMessage.fullName} (${schemeOrMessage.name}). Who is eligible, what benefits does it give, and how do I apply?`;
    setPendingChatMessage(msg);
    setActiveView("chat");
  }, []);

  return (
    <div className="app">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
      />
      <main className="main">
        {activeView === "chat" && (
          <ChatView
            lang={lang}
            sessionId={sessionId}
            pendingMessage={pendingChatMessage}
            onPendingMessageSent={() => setPendingChatMessage(null)}
            onSessionReset={handleSessionReset}
          />
        )}
        {activeView === "schemes" && (
          <SchemesView lang={lang} onAskAbout={handleAskAbout} />
        )}
        {activeView === "eligibility" && (
          <EligibilityView lang={lang} onGoToChat={handleAskAbout} />
        )}
      </main>
    </div>
  );
}

export default App;
