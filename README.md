#  Jan Saathi — जन साथी
### AI-Powered Citizen Services Assistant for India

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs)
![Gemini](https://img.shields.io/badge/Google-Gemini%20AI-4285F4?style=for-the-badge&logo=google)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

**Helping every Indian citizen discover government schemes they deserve — in their own language.**

---

## 📌 Table of Contents

- [About the Project](#-about-the-project)
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [How to Use](#-how-to-use)
- [Government Schemes Covered](#-government-schemes-covered)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Developer](#-developer)

---

## 📖 About the Project

**Jan Saathi (जन साथी)** means "People's Companion" in Hindi. It is a full-stack AI-powered web application that acts as a personal guide for every Indian citizen — explaining government welfare schemes in simple language, checking eligibility, and guiding through the application process in the user's preferred language.

> 💡 Built for the **AI for Governance & Citizen Services** hackathon track

---

## ❗ Problem Statement

Millions of eligible Indian citizens miss out on government welfare schemes every year because:

- 📚 Information is written in complex bureaucratic language
- 🌐 Most portals are only in English
- 🤷 Citizens don't know which schemes they qualify for
- 📋 Application process is confusing and intimidating
- 📍 No single platform to discover all schemes

**Jan Saathi solves all of these problems in one place.**

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 🤖 **AI Chatbot** | Conversational AI powered by Google Gemini that explains schemes in simple language |
| 🎯 **Eligibility Checker** | Smart quiz that matches users to relevant schemes based on their profile |
| 📋 **Scheme Browser** | Browse, search, and filter 10+ government schemes by category |
| 🌐 **Multilingual Support** | Full support for Hindi, Telugu, Tamil, and English |
| 🎤 **Voice Input** | Speak your questions using the microphone (great for low-literacy users) |
| 📱 **Responsive Design** | Works perfectly on mobile, tablet, and desktop |
| ⚡ **Fast Responses** | Powered by Gemini 3.6 Flash — latest and fastest AI model |
| 🔗 **Direct Apply Links** | Every scheme links directly to the official government portal |

---

## 🛠️ Tech Stack

### Frontend
- **React.js 18** — UI framework
- **CSS3** — Glassmorphism design, animations, gradients
- **Lucide React** — Icons
- **Web Speech API** — Voice input
- **Google Fonts (Inter + Nunito)** — Typography

### Backend
- **Node.js** — Server runtime
- **Express.js** — REST API
- **Google Gemini AI (3.6 Flash)** — AI responses
- **CORS** — Cross-origin handling
- **dotenv** — Environment variables

### Deployment
- **Vercel** — Frontend hosting
- **Render** — Backend hosting
- **GitHub** — Version control

---

## 🚀 Getting Started

### Prerequisites

Make sure you have these installed:
- [Node.js](https://nodejs.org) (v18 or higher)
- A Google Gemini API key (free at [aistudio.google.com](https://aistudio.google.com/apikey))

### Installation

**Step 1 — Clone the repository:**
```bash
git clone https://github.com/rishi1188/Jan-Saathi.git
cd Jan-Saathi
```

**Step 2 — Set up Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

**Step 3 — Set up Frontend:**
```bash
cd ../frontend
npm install --legacy-peer-deps
```

Make sure `frontend/src/utils/api.js` line 1 is:
```javascript
const BASE_URL = "http://localhost:3001/api";
```

### Running the Project

You need **two terminal windows**:

**Terminal 1 — Start Backend:**
```bash
cd backend
node server.js
```
You should see:
```
🚀 Jan Saathi Backend running on http://localhost:3001
📋 API Key: ✅ Configured
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm start
```
Browser opens automatically at **http://localhost:3000**

---

## 📱 How to Use

### 1️⃣ Chat with Jan Saathi

- Open the app and you'll see the **Chat page** by default
- Type your question in the input box at the bottom
- Press **Enter** or click the **Send button**
- Jan Saathi will reply with clear, simple information

**Example questions you can ask:**
```
"What schemes are available for farmers?"
"How do I apply for Ayushman Bharat?"
"I need a loan for my small business"
"What benefits can I get as a daily wage worker?"
"Schemes for girl child education"
```

### 2️⃣ Switch Languages

- Look at the **left sidebar** at the bottom
- Click any language button:
  - **English** — English
  - **हिंदी** — Hindi
  - **తెలుగు** — Telugu
  - **தமிழ்** — Tamil
- The AI will automatically respond in your selected language!

### 3️⃣ Use Voice Input

- Click the **microphone icon** 🎤 in the chat input box
- Speak your question clearly
- Jan Saathi will automatically understand and respond
- Works in all 4 languages!

### 4️⃣ Check Your Eligibility

- Click **"Eligibility Check"** in the left sidebar
- Fill in the form:
  - Your occupation (farmer, student, worker, etc.)
  - Where you live (rural/urban)
  - Your gender and age
  - Annual family income
  - Social category (General/OBC/SC/ST)
  - Whether you have a bank account, LPG connection, etc.
- Click **"Find My Schemes"** button
- See all schemes you qualify for with direct apply links!

### 5️⃣ Browse All Schemes

- Click **"Browse Schemes"** in the left sidebar
- You'll see all 10+ government schemes as cards
- **Search** by typing keywords (e.g., "health", "farmer", "loan")
- **Filter** by category (Agriculture, Health, Housing, etc.)
- Click **"Documents"** on any card to see what papers you need
- Click **"Apply Now"** to go directly to the official website
- Click **"Ask AI"** to get more details from Jan Saathi

---

## 🏛️ Government Schemes Covered

| # | Scheme | Category | Benefit |
|---|--------|----------|---------|
| 1 | **PM-KISAN** | Agriculture | ₹6,000/year for farmers |
| 2 | **Ayushman Bharat PM-JAY** | Health | ₹5 lakh health insurance |
| 3 | **PMAY-Gramin** | Housing | ₹1.2 lakh for rural house |
| 4 | **PM Ujjwala Yojana** | Energy | Free LPG connection for women |
| 5 | **PM Jan Dhan Yojana** | Banking | Zero-balance bank account |
| 6 | **Sukanya Samriddhi Yojana** | Savings | High-interest savings for girl child |
| 7 | **PM MUDRA Yojana** | Business | Loan up to ₹10 lakh |
| 8 | **e-Shram Card** | Labour | ₹2 lakh accident insurance |
| 9 | **MGNREGS** | Employment | 100 days guaranteed employment |
| 10 | **Post-Matric Scholarship** | Education | SC/ST student scholarships |

---

## 📡 API Reference

### Base URL
```
http://localhost:3001/api
```

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Check server status |
| GET | `/session` | Generate new session ID |
| POST | `/chat` | Send message to AI |
| GET | `/chat/history/:id` | Get conversation history |
| DELETE | `/chat/:id` | Clear conversation |
| GET | `/schemes` | List all schemes |
| GET | `/schemes/:id` | Get single scheme |
| POST | `/schemes/eligibility` | Check eligibility |

### Chat Request Example
```json
POST /api/chat
{
  "message": "What schemes are available for farmers?",
  "sessionId": "uuid-here",
  "language": "hi"
}
```

### Eligibility Check Example
```json
POST /api/schemes/eligibility
{
  "occupation": "farmer",
  "residence": "rural",
  "income": "below_poverty_line",
  "gender": "male",
  "category": "OBC",
  "age": 35,
  "hasBankAccount": true
}
```

---

## 📁 Project Structure

```
Jan-Saathi/
│
├── backend/                        
│   ├── server.js                   # Main server entry point
│   ├── package.json                # Backend dependencies
│   ├── .env                        # API keys (not in GitHub)
│   ├── routes/
│   │   ├── chat.js                 # AI chat with Gemini
│   │   └── schemes.js              # Scheme search & eligibility
│   └── data/
│       └── schemes.js              # Government schemes database
│
└── frontend/                       
    ├── public/
    │   └── index.html              
    ├── src/
    │   ├── App.js                  # Root component
    │   ├── App.css                 # Global styles
    │   ├── index.js                # React entry point
    │   ├── components/
    │   │   ├── ChatView.jsx        # Chat interface
    │   │   ├── SchemesView.jsx     # Browse schemes
    │   │   ├── EligibilityView.jsx # Eligibility checker
    │   │   └── Sidebar.jsx         # Navigation + language
    │   └── utils/
    │       ├── api.js              # Backend API calls
    │       └── i18n.js             # Translations
    └── package.json                
```

---

## 🚀 Future Roadmap

- [ ] 1000+ schemes from myscheme.gov.in using RAG pipeline
- [ ] WhatsApp integration for feature phone users
- [ ] State-specific schemes (AP, Telangana, Tamil Nadu, etc.)
- [ ] Offline PWA mode for low connectivity areas
- [ ] Document checklist generator with PDF download
- [ ] Application status tracker
- [ ] Integration with DigiLocker for document verification

---

## 👨‍💻 Developer

**Thota Rushivardhan Reddy (Rishi)**

- 🎓 B.Tech CSE (AI/ML) — Mohan Babu University, Tirupati, AP
- 📧 rushivardhan804@gmail.com
- 💼 [LinkedIn](https://linkedin.com/in/rishi-reddy2818/)
- 🐙 [GitHub](https://github.com/rishi1188)

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for Bharat 🇮🇳**

*Empowering every Indian citizen with knowledge of their rights and benefits*

⭐ Star this repo if you found it helpful!

</div>
