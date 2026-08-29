const BASE_URL = "http://localhost:3001/api";

async function fetchJSON(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Network error" }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getSession: () => fetchJSON("/session"),

  sendMessage: (message, sessionId, language, userProfile) =>
    fetchJSON("/chat", {
      method: "POST",
      body: JSON.stringify({ message, sessionId, language, userProfile }),
    }),

  getHistory: (sessionId) => fetchJSON(`/chat/history/${sessionId}`),

  clearSession: (sessionId) =>
    fetchJSON(`/chat/${sessionId}`, { method: "DELETE" }),

  getSchemes: (q = "", category = "") =>
    fetchJSON(`/schemes?q=${encodeURIComponent(q)}&category=${encodeURIComponent(category)}`),

  getScheme: (id) => fetchJSON(`/schemes/${id}`),

  checkEligibility: (profile) =>
    fetchJSON("/schemes/eligibility", {
      method: "POST",
      body: JSON.stringify(profile),
    }),

  health: () => fetchJSON("/health"),
};
