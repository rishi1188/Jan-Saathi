import React, { useState, useEffect } from "react";
import { ExternalLink, FileText, MessageCircle, Search } from "lucide-react";
import { api } from "../utils/api";
import { t } from "../utils/i18n";

const CATEGORY_ICONS = {
  Agriculture: "🌾", Health: "🏥", Housing: "🏠", Energy: "⚡",
  Banking: "🏦", Savings: "💰", Business: "💼", Labour: "🔨",
  Employment: "👷", Education: "📚",
};

function SchemeCard({ scheme, lang, onAskAbout }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="scheme-card">
      <div className="scheme-card-header">
        <div style={{ flex: 1 }}>
          <div className="scheme-name">{scheme.name}</div>
          <div className="scheme-full-name">{scheme.fullName}</div>
        </div>
        <span className={`scheme-category-badge ${scheme.category}`}>
          {CATEGORY_ICONS[scheme.category]} {scheme.category}
        </span>
      </div>

      <div className="scheme-benefit">
        <div className="scheme-benefit-icon">✅</div>
        <div className="scheme-benefit-text">{scheme.benefit}</div>
      </div>

      <div className="scheme-desc">{scheme.description}</div>

      {expanded && (
        <div style={{
          background: "var(--gray-50)",
          borderRadius: "var(--radius-md)",
          padding: "12px 14px",
          marginBottom: 14,
          border: "1px solid var(--gray-100)",
          animation: "fadeIn 0.3s ease"
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "var(--gray-400)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.5px" }}>
            📋 Documents Required
          </div>
          <ul style={{ paddingLeft: 16, fontSize: 12.5, color: "var(--gray-600)", lineHeight: 2 }}>
            {scheme.documents?.map((doc, i) => <li key={i}>{doc}</li>)}
          </ul>
          <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--gray-400)" }}>
            <strong style={{ color: "var(--gray-500)" }}>Ministry:</strong> {scheme.ministry}
          </div>
        </div>
      )}

      <div className="scheme-card-footer">
        <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <ExternalLink size={12} /> {t(lang, "applyNow")}
        </a>
        <button className="btn-outline" onClick={() => setExpanded((v) => !v)}>
          <FileText size={12} />
          {expanded ? "Hide Docs" : "Documents"}
        </button>
        <button className="btn-outline" onClick={() => onAskAbout(scheme)} style={{ marginLeft: "auto" }}>
          <MessageCircle size={12} /> Ask AI
        </button>
      </div>
    </div>
  );
}

export default function SchemesView({ lang, onAskAbout }) {
  const [schemes, setSchemes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getSchemes(search, activeCategory)
      .then((data) => {
        setSchemes(data.schemes || []);
        if (data.categories) setCategories(data.categories);
      })
      .catch(() => setSchemes([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory]);

  return (
    <div className="schemes-view">
      <div className="schemes-header">
        <div className="schemes-title">📋 {t(lang, "schemes")}</div>
        <div className="schemes-subtitle">
          {schemes.length} {t(lang, "schemeCount")} — click any card to explore
        </div>
      </div>

      {/* Search */}
      <div className="schemes-search">
        <div style={{ position: "relative", flex: 1 }}>
          <Search size={15} style={{
            position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            color: "var(--gray-300)", pointerEvents: "none"
          }} />
          <input
            className="search-input"
            style={{ paddingLeft: 40 }}
            placeholder="Search by scheme name, benefit, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="category-chips">
        <button className={`category-chip ${activeCategory === "" ? "active" : ""}`}
          onClick={() => setActiveCategory("")}>
          🗂️ All
        </button>
        {categories.map((cat) => (
          <button key={cat}
            className={`category-chip ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(activeCategory === cat ? "" : cat)}>
            {CATEGORY_ICONS[cat]} {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 60 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            border: "3px solid var(--indigo-mid)",
            borderTopColor: "var(--indigo)",
            animation: "spin 0.8s linear infinite"
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : schemes.length === 0 ? (
        <div style={{
          textAlign: "center", padding: 56,
          background: "rgba(255,255,255,0.8)", borderRadius: "var(--radius-xl)",
          border: "1px solid var(--gray-100)", backdropFilter: "blur(10px)"
        }}>
          <div style={{ fontSize: 44, marginBottom: 14 }}>🔍</div>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 18, color: "var(--gray-700)", marginBottom: 6 }}>
            No schemes found
          </div>
          <div style={{ fontSize: 13, color: "var(--gray-400)" }}>Try a different search term or category</div>
        </div>
      ) : (
        <div className="schemes-grid">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} lang={lang} onAskAbout={onAskAbout} />
          ))}
        </div>
      )}
    </div>
  );
}
