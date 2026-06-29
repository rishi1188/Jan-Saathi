const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { searchSchemes } = require("../data/schemes");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// In-memory session store
const sessions = {};

const SYSTEM_PROMPT = `You are Jan Saathi (जन साथी), a friendly and helpful AI assistant for Indian citizens. Your mission is to help people discover government schemes and benefits they qualify for.

PERSONALITY:
- Warm, patient, and simple in language — many users have low digital literacy
- Never use bureaucratic jargon; explain everything in plain, everyday words
- When a user writes in Hindi, Telugu, or Tamil — respond in that SAME language
- Be encouraging — many citizens don't know they're missing out on benefits they deserve

YOUR CAPABILITIES:
1. Explain government schemes in simple language
2. Help users find schemes they are eligible for (ask about their occupation, income, family, location)
3. Guide them on what documents to prepare
4. Direct them to official application links
5. Support Hindi, Telugu, Tamil, and English

IMPORTANT RULES:
- Only mention real, verified government schemes
- Always provide the official website link when suggesting a scheme
- Never ask for personal documents or sensitive financial information
- Keep responses concise and easy to read — use simple bullet points when listing things
- If user asks in Hindi/Telugu/Tamil, respond in that language throughout

SCHEME DATABASE:
You have access to the following schemes: PM-KISAN (farmers), Ayushman Bharat (health insurance), PMAY-G (rural housing), PM Ujjwala (LPG for women), Jan Dhan Yojana (banking), Sukanya Samriddhi (girl child savings), MUDRA Loan (small business), e-Shram (unorganised workers), MGNREGS (rural employment), Post-Matric Scholarship (SC/ST students).

FORMAT:
- Use clear headings and bullet points
- When recommending a scheme, always include: What it gives, Who can apply, Key documents needed, Where to apply
- End responses with a helpful follow-up question to narrow down more relevant schemes`;

function buildContextFromSchemes(message) {
  const relevant = searchSchemes(message.toLowerCase());
  if (relevant.length === 0) return "";
  const top = relevant.slice(0, 3);
  return (
    "\n\nRELEVANT SCHEME DATA:\n" +
    top.map((s) =>
      `- ${s.fullName}: ${s.benefit}. Tags: ${s.tags.join(", ")}. Apply at: ${s.applyUrl}`
    ).join("\n")
  );
}

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, sessionId, language = "en", userProfile = {} } = req.body;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Initialize session
    if (!sessions[sessionId]) {
      sessions[sessionId] = { history: [], language, userProfile };
    }
    const session = sessions[sessionId];
    session.language = language;

    // Language instruction
    const langInstructions = {
      hi: "ALWAYS respond in Hindi (Devanagari script).",
      te: "ALWAYS respond in Telugu script.",
      ta: "ALWAYS respond in Tamil script.",
      en: "Respond in English.",
    };
    const langNote = langInstructions[language] || langInstructions.en;
    const profileNote = Object.keys(session.userProfile).length > 0
      ? `\nUSER PROFILE: ${JSON.stringify(session.userProfile)}`
      : "";

    const fullSystem = SYSTEM_PROMPT + `\n\nLANGUAGE: ${langNote}` + profileNote;
    const schemeContext = buildContextFromSchemes(message);
    const userMessage = schemeContext ? `${message}\n\n[Context:${schemeContext}]` : message;

    // Build Gemini model
    // New (Working)
const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    // Build history for Gemini (role: user/model)
    const history = session.history.slice(-10).map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(userMessage);
    const assistantMessage = result.response.text();

    // Save to session
    session.history.push({ role: "user", content: message });
    session.history.push({ role: "assistant", content: assistantMessage });
    if (session.history.length > 20) session.history = session.history.slice(-20);

    res.json({ message: assistantMessage, sessionId, language });

  } catch (error) {
    console.error("Chat error:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// GET /api/chat/history/:sessionId
router.get("/history/:sessionId", (req, res) => {
  const session = sessions[req.params.sessionId];
  if (!session) return res.json({ messages: [] });
  res.json({ messages: session.history, language: session.language });
});

// DELETE /api/chat/:sessionId
router.delete("/:sessionId", (req, res) => {
  delete sessions[req.params.sessionId];
  res.json({ success: true });
});

module.exports = router;
