import React from "react";
import { MessageCircle, BookOpen, CheckSquare, Zap } from "lucide-react";
import { t, languages } from "../utils/i18n";

export default function Sidebar({ activeView, setActiveView, lang, setLang }) {
  const navItems = [
    { id: "chat", icon: <MessageCircle size={18} />, label: t(lang, "newChat"), color: "#6366F1" },
    { id: "schemes", icon: <BookOpen size={18} />, label: t(lang, "schemes"), color: "#10B981" },
    { id: "eligibility", icon: <CheckSquare size={18} />, label: t(lang, "eligibilityCheck"), color: "#F97316" },
  ];

  const stats = [
    { label: "Schemes Available", value: "10+" },
    { label: "Languages", value: "4" },
    { label: "Categories", value: "10" },
  ];

  return (
    <div className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-mark">
          <div className="logo-emblem">🙏</div>
          <div className="logo-text">{t(lang, "appName")}</div>
        </div>
        <div className="logo-tagline">{t(lang, "tagline")}</div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <div className="nav-section-label">Navigation</div>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-btn ${activeView === item.id ? "active" : ""}`}
            onClick={() => setActiveView(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}

        {/* Stats */}
        <div className="nav-section-label" style={{ marginTop: 20 }}>Overview</div>
        <div className="sidebar-stats">
          {stats.map((s) => (
            <div className="stat-item" key={s.label}>
              <span className="stat-label">{s.label}</span>
              <span className="stat-value">{s.value}</span>
            </div>
          ))}
        </div>

        {/* Data source */}
        <div style={{ marginTop: 12 }}>
          <div className="nav-section-label">Data Source</div>
          <div style={{
            padding: "10px 12px",
            background: "var(--gray-50)",
            borderRadius: "var(--radius-md)",
            fontSize: 11,
            color: "var(--gray-400)",
            lineHeight: 1.7,
            border: "1px solid var(--gray-100)"
          }}>
            <Zap size={11} style={{ verticalAlign: "middle", marginRight: 4, color: "var(--coral)" }} />
            Powered by{" "}
            <a href="https://www.myscheme.gov.in" target="_blank" rel="noopener noreferrer"
              style={{ color: "var(--indigo)", textDecoration: "none", fontWeight: 600 }}>
              myscheme.gov.in
            </a>
          </div>
        </div>
      </nav>

      {/* Language picker */}
      <div className="sidebar-lang">
        <div className="lang-label">Language / भाषा</div>
        <div className="lang-grid">
          {languages.map((l) => (
            <button
              key={l.code}
              className={`lang-btn ${lang === l.code ? "active" : ""}`}
              onClick={() => setLang(l.code)}
              title={l.name}
            >
              {l.native}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
