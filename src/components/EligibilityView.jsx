import React, { useState } from "react";
import { CheckCircle, ExternalLink, ChevronRight, Sparkles, Shield, Users, TrendingUp, Award, FileText, Phone } from "lucide-react";
import { api } from "../utils/api";
import { t } from "../utils/i18n";

const OCCUPATIONS = [
  { value: "farmer", label: "🌾 Farmer" },
  { value: "unorganised_worker", label: "🔨 Daily wage / Labour" },
  { value: "self_employed", label: "🏪 Self-employed" },
  { value: "small_business", label: "💼 Small business" },
  { value: "government_employee", label: "🏛️ Government Employee" },
  { value: "student", label: "📚 Student" },
  { value: "artisan", label: "🎨 Artisan" },
  { value: "trader", label: "🛒 Trader" },
  { value: "homemaker", label: "🏠 Homemaker" },
  { value: "other", label: "👤 Other" },
];

const INCOME_LEVELS = [
  { value: "below_poverty_line", label: "Below ₹1 lakh/year" },
  { value: "low", label: "₹1–3 lakh/year" },
  { value: "medium", label: "₹3–6 lakh/year" },
  { value: "above", label: "Above ₹6 lakh/year" },
];

const CATEGORIES = [
  { value: "GEN", label: "General" },
  { value: "OBC", label: "OBC" },
  { value: "SC", label: "SC" },
  { value: "ST", label: "ST" },
];

const POPULAR_SCHEMES = [
  { name: "PM-KISAN", icon: "🌾", benefit: "₹6,000/year", category: "Agriculture", color: "#10B981" },
  { name: "Ayushman Bharat", icon: "🏥", benefit: "₹5 lakh health cover", category: "Health", color: "#6366F1" },
  { name: "MUDRA Loan", icon: "💼", benefit: "Loan up to ₹10 lakh", category: "Business", color: "#F97316" },
  { name: "PMAY-G", icon: "🏠", benefit: "₹1.2 lakh for house", category: "Housing", color: "#8B5CF6" },
  { name: "e-Shram Card", icon: "🔨", benefit: "₹2 lakh insurance", category: "Labour", color: "#EC4899" },
  { name: "Jan Dhan", icon: "🏦", benefit: "Zero-balance account", category: "Banking", color: "#0EA5E9" },
];

const STATS = [
  { icon: <Shield size={20} />, value: "10+", label: "Schemes Available", color: "#6366F1", bg: "#EEF2FF" },
  { icon: <Users size={20} />, value: "1Cr+", label: "Citizens Helped", color: "#10B981", bg: "#ECFDF5" },
  { icon: <TrendingUp size={20} />, value: "₹50K+", label: "Avg. Annual Benefit", color: "#F97316", bg: "#FFF7ED" },
  { icon: <Award size={20} />, value: "100%", label: "Free to Apply", color: "#8B5CF6", bg: "#F5F3FF" },
];

function RadioGroup({ options, value, onChange }) {
  return (
    <div className="radio-group">
      {options.map((opt) => (
        <label key={opt.value}
          className={`radio-option ${value === opt.value ? "selected" : ""}`}
          onClick={() => onChange(opt.value)}>
          <input type="radio" style={{ display: "none" }} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function ResultCard({ scheme, lang }) {
  return (
    <div className="scheme-card" style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <div>
          <div className="scheme-name">{scheme.name}</div>
          <div className="scheme-full-name">{scheme.fullName}</div>
        </div>
        <div style={{
          width: 28, height: 28, background: "var(--mint-light)",
          borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
        }}>
          <CheckCircle size={16} color="var(--mint)" />
        </div>
      </div>
      <div className="scheme-benefit">
        <div className="scheme-benefit-icon">✅</div>
        <div className="scheme-benefit-text">{scheme.benefit}</div>
      </div>
      <div style={{ marginTop: 12 }}>
        <a href={scheme.applyUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
          <ExternalLink size={12} /> {t(lang, "applyNow")}
        </a>
      </div>
    </div>
  );
}

export default function EligibilityView({ lang, onGoToChat }) {
  const [form, setForm] = useState({
    occupation: "", residence: "", income: "", gender: "",
    category: "", age: "", hasBankAccount: null, hasLPG: null, hasPuccaHouse: null,
  });
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleCheck = async () => {
    if (!form.occupation || !form.residence || !form.income) {
      setError("Please fill in occupation, residence, and income to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const payload = { ...form, age: form.age ? parseInt(form.age) : undefined };
      const data = await api.checkEligibility(payload);
      setResults(data);
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (err) {
      setError(err.message || "Failed to check eligibility. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = () => {
    const incomeLabel = INCOME_LEVELS.find((l) => l.value === form.income)?.label || form.income;
    const summary = `I am a ${form.occupation?.replace(/_/g, " ")}, living in a ${form.residence} area, with annual income ${incomeLabel}. ${form.gender ? `I am ${form.gender}.` : ""} ${form.category ? `My caste category is ${form.category}.` : ""} What government schemes am I eligible for?`;
    onGoToChat(summary);
  };

  const stepStyle = {
    display: "flex", alignItems: "center", justifyContent: "center",
    width: 28, height: 28, borderRadius: "50%",
    background: "var(--gradient-primary)", color: "white",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
    boxShadow: "0 2px 8px rgba(99,102,241,0.3)"
  };

  return (
    <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Page Header */}
      <div style={{
        padding: "20px 28px 0",
        background: "rgba(255,255,255,0.6)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid var(--gray-100)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 14,
            background: "var(--gradient-primary)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 22, boxShadow: "0 4px 12px rgba(99,102,241,0.3)"
          }}>🎯</div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 800, color: "var(--gray-800)", letterSpacing: "-0.5px" }}>
              Eligibility Checker
            </div>
            <div style={{ fontSize: 13, color: "var(--gray-400)", fontWeight: 500 }}>
              Discover government schemes you qualify for in seconds
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display: "flex", gap: 16, paddingBottom: 16, overflowX: "auto" }}>
          {STATS.map((s) => (
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: s.bg, padding: "8px 16px",
              borderRadius: "var(--radius-full)", flexShrink: 0,
              border: `1px solid ${s.color}20`
            }}>
              <div style={{ color: s.color }}>{s.icon}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: 10.5, color: "var(--gray-400)", fontWeight: 600, marginTop: 1 }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-column layout */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* LEFT — Form */}
        <div style={{ width: "50%", overflowY: "auto", padding: "24px 20px 24px 28px", borderRight: "1px solid var(--gray-100)" }}>

          {/* Step 1 */}
          <div className="form-section">
            <div className="form-section-title">
              <div style={stepStyle}>1</div>
              About You
            </div>
            <div className="form-row">
              <label className="form-label">What is your main occupation?</label>
              <RadioGroup options={OCCUPATIONS} value={form.occupation} onChange={set("occupation")} />
            </div>
            <div className="form-row">
              <label className="form-label">Where do you live?</label>
              <RadioGroup
                options={[
                  { value: "rural", label: "🌳 Rural / Village" },
                  { value: "urban", label: "🏙️ Urban / City" },
                ]}
                value={form.residence}
                onChange={set("residence")}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Your gender</label>
              <RadioGroup
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
                value={form.gender}
                onChange={set("gender")}
              />
            </div>
            <div className="form-row">
              <label className="form-label">Your age (optional)</label>
              <input
                className="form-input"
                type="number" min={10} max={100}
                placeholder="e.g. 35"
                value={form.age}
                onChange={(e) => set("age")(e.target.value)}
                style={{ maxWidth: 140 }}
              />
            </div>
          </div>

          {/* Step 2 */}
          <div className="form-section">
            <div className="form-section-title">
              <div style={stepStyle}>2</div>
              Income & Category
            </div>
            <div className="form-row">
              <label className="form-label">Annual family income</label>
              <RadioGroup options={INCOME_LEVELS} value={form.income} onChange={set("income")} />
            </div>
            <div className="form-row">
              <label className="form-label">Social category</label>
              <RadioGroup options={CATEGORIES} value={form.category} onChange={set("category")} />
            </div>
          </div>

          {/* Step 3 */}
          <div className="form-section">
            <div className="form-section-title">
              <div style={stepStyle}>3</div>
              Current Situation
            </div>
            <div className="form-row">
              <label className="form-label">Do you have a bank account?</label>
              <RadioGroup
                options={[{ value: "yes", label: "✅ Yes" }, { value: "no", label: "❌ No" }]}
                value={form.hasBankAccount === null ? "" : form.hasBankAccount ? "yes" : "no"}
                onChange={(v) => set("hasBankAccount")(v === "yes")}
              />
            </div>
            {form.gender === "female" && (
              <div className="form-row">
                <label className="form-label">Do you have an LPG gas connection?</label>
                <RadioGroup
                  options={[{ value: "yes", label: "✅ Yes" }, { value: "no", label: "❌ No" }]}
                  value={form.hasLPG === null ? "" : form.hasLPG ? "yes" : "no"}
                  onChange={(v) => set("hasLPG")(v === "yes")}
                />
              </div>
            )}
            {form.residence === "rural" && (
              <div className="form-row">
                <label className="form-label">Do you have a pucca (permanent) house?</label>
                <RadioGroup
                  options={[{ value: "yes", label: "✅ Yes" }, { value: "no", label: "❌ No" }]}
                  value={form.hasPuccaHouse === null ? "" : form.hasPuccaHouse ? "yes" : "no"}
                  onChange={(v) => set("hasPuccaHouse")(v === "yes")}
                />
              </div>
            )}
          </div>

          {error && (
            <div className="error-banner">⚠️ {error}
              <button onClick={() => setError(null)}
                style={{ marginLeft: "auto", background: "none", color: "#DC2626", fontSize: 18 }}>×</button>
            </div>
          )}

          <button className="check-btn" onClick={handleCheck} disabled={loading}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <div style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.4)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                Checking your eligibility...
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </span>
            ) : (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Sparkles size={18} /> Find My Schemes <ChevronRight size={18} />
              </span>
            )}
          </button>
        </div>

        {/* RIGHT — Info panel or Results */}
        <div style={{ width: "50%", overflowY: "auto", padding: "24px 28px 24px 20px" }}>

          {!results ? (
            <>
              {/* How it works */}
              <div style={{
                background: "linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)",
                borderRadius: "var(--radius-xl)", padding: "20px",
                marginBottom: 20, border: "1px solid var(--indigo-mid)"
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--indigo-dark)", marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                  <Sparkles size={16} color="var(--indigo)" /> How it works
                </div>
                {[
                  { step: "1", text: "Fill in your basic details on the left", icon: "📝" },
                  { step: "2", text: "Click 'Find My Schemes' button", icon: "🔍" },
                  { step: "3", text: "See schemes matched to your profile", icon: "🎯" },
                  { step: "4", text: "Apply directly on the official website", icon: "✅" },
                ].map((item) => (
                  <div key={item.step} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%",
                      background: "white", display: "flex", alignItems: "center",
                      justifyContent: "center", fontSize: 16, flexShrink: 0,
                      boxShadow: "0 2px 8px rgba(99,102,241,0.15)"
                    }}>{item.icon}</div>
                    <div style={{ fontSize: 13, color: "var(--gray-600)", fontWeight: 500 }}>{item.text}</div>
                  </div>
                ))}
              </div>

              {/* Popular schemes */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--gray-700)", marginBottom: 14, display: "flex", alignItems: "center", gap: 8 }}>
                  🔥 Popular Schemes
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  {POPULAR_SCHEMES.map((s) => (
                    <div key={s.name} style={{
                      background: "white", borderRadius: "var(--radius-lg)",
                      padding: "12px 14px", border: "1px solid var(--gray-100)",
                      boxShadow: "var(--shadow-xs)", transition: "all 0.2s ease",
                      cursor: "default"
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "var(--shadow-md)"; }}
                      onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-xs)"; }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--gray-700)", marginBottom: 2 }}>{s.name}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: s.color }}>{s.benefit}</div>
                      <div style={{
                        display: "inline-block", marginTop: 6, fontSize: 10,
                        padding: "2px 8px", borderRadius: "var(--radius-full)",
                        background: `${s.color}15`, color: s.color, fontWeight: 600
                      }}>{s.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Documents tip */}
              <div style={{
                background: "linear-gradient(135deg, #ECFDF5 0%, #F0F9FF 100%)",
                borderRadius: "var(--radius-xl)", padding: "18px",
                border: "1px solid var(--mint-mid)", marginBottom: 20
              }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "#065F46", marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
                  <FileText size={15} /> Keep these documents ready
                </div>
                {["Aadhaar Card", "Bank Account Details", "Ration Card / BPL Certificate", "Income Certificate", "Caste Certificate (if applicable)", "Land records (for farmers)"].map((doc) => (
                  <div key={doc} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--mint)", flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, color: "var(--gray-600)", fontWeight: 500 }}>{doc}</span>
                  </div>
                ))}
              </div>

              {/* Helpline */}
              <div style={{
                background: "linear-gradient(135deg, var(--coral-light) 0%, #FFF7ED 100%)",
                borderRadius: "var(--radius-xl)", padding: "16px 18px",
                border: "1px solid var(--coral-mid)",
                display: "flex", alignItems: "center", gap: 14
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "var(--gradient-coral)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, boxShadow: "0 4px 12px rgba(249,115,22,0.3)"
                }}>
                  <Phone size={18} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: "var(--gray-700)" }}>Need help applying?</div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)", marginTop: 2 }}>
                    Call Helpline: <strong style={{ color: "var(--coral)" }}>1800-11-5526</strong> (Toll Free)
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Results panel */
            <div id="results-section" style={{ animation: "fadeIn 0.5s ease" }}>
              <div style={{
                background: results.total > 0 ? "linear-gradient(135deg, #ECFDF5 0%, #EEF2FF 100%)" : "var(--gray-50)",
                borderRadius: "var(--radius-xl)", padding: "18px 20px",
                marginBottom: 20, border: `1px solid ${results.total > 0 ? "var(--mint-mid)" : "var(--gray-200)"}`,
                display: "flex", alignItems: "center", gap: 14
              }}>
                <div style={{ fontSize: 40 }}>{results.total > 0 ? "🎉" : "🤔"}</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 18, color: "var(--gray-800)", marginBottom: 4 }}>
                    {results.total > 0 ? `${results.total} Scheme${results.total > 1 ? "s" : ""} Found!` : "No direct matches"}
                  </div>
                  <div style={{ fontSize: 12.5, color: "var(--gray-500)" }}>
                    {results.total > 0 ? "Based on your profile, you may qualify for these schemes" : "Try asking the AI for personalized recommendations"}
                  </div>
                </div>
              </div>

              {results.schemes?.map((scheme) => (
                <ResultCard key={scheme.id} scheme={scheme} lang={lang} />
              ))}

              {/* AI CTA */}
              <div style={{
                background: "linear-gradient(135deg, var(--indigo-light) 0%, var(--purple-light) 100%)",
                borderRadius: "var(--radius-xl)", padding: "20px",
                border: "1px solid var(--indigo-mid)",
                display: "flex", alignItems: "flex-start", gap: 14,
                animation: "fadeIn 0.5s ease"
              }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>🤖</div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "var(--indigo-dark)", marginBottom: 4, fontSize: 14 }}>
                    Want detailed guidance?
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)", marginBottom: 12, lineHeight: 1.6 }}>
                    Jan Saathi AI can explain how to apply, what documents you need, and answer all your questions in your language.
                  </div>
                  <button onClick={handleAskAI} style={{
                    background: "var(--gradient-primary)", color: "white",
                    border: "none", padding: "9px 18px",
                    borderRadius: "var(--radius-md)", fontWeight: 600,
                    fontSize: 13, cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    <Sparkles size={14} /> Ask AI Assistant →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
