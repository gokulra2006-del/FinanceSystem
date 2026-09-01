<div align="center">
  <img src="frontend/public/logo.png" alt="SentinelIQ Logo" width="120" />
  <h1>SentinelIQ 🧠📈</h1>
  <p><strong>Multi-Agent Autonomous Financial Intelligence</strong></p>
  <p>
    SentinelIQ is a powerful, autonomous AI-driven financial intelligence dashboard. It simulates a war room of expert financial agents analyzing portfolios, executing stress tests, mitigating cognitive biases, and intercepting risky trades in real-time.
  </p>
</div>

---

## 🌟 Key Features

* **🤖 Autonomous Agent War Room:** Multiple specialized AI agents (e.g., Risk Analyst, Momentum Trader, Value Investor) independently evaluate financial theses and reach consensus.
* **🛡️ Decision Firewall:** Real-time interception of risky trades with automated stress testing and cognitive bias detection.
* **📊 Live Telemetry:** Integrates real-time financial market data seamlessly into a beautiful, dynamic dashboard.
* **🪞 Behavioral Mirror:** Analyzes user trading behavior to highlight biases like "Loss Aversion" or "Momentum Chasing".
* **⏪ Regret Ledger:** Point-in-time replay state allows you to re-run historical decisions and analyze "what-if" scenarios.

## 🚀 Tech Stack

* **Frontend:** Next.js, React, TailwindCSS, Recharts, Framer Motion
* **Backend:** Node.js, Express.js
* **AI Engine:** Groq API (Llama 3.3 70B & Llama 3.1 8B)
* **Market Data:** Finnhub (Live Quotes) & Alpha Vantage (Historical Time Series)

## 🛠️ Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/FinanceIntelligenceSystem.git
cd FinanceIntelligenceSystem
```

### 2. Configure Environment Variables
Create a `.env` file in the `backend/` directory:
```env
GROQ_API_KEY=your_groq_api_key
ALPHAVANTAGE_API_KEY=your_alphavantage_key
FINNHUB_API_KEY=your_finnhub_key
```

### 3. Install Dependencies
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Run the Application
Open two terminal windows:

**Terminal 1 (Backend):**
```bash
cd backend
node index.js
```
*Backend runs on http://localhost:3001*

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
*Frontend runs on http://localhost:3000*

## 🎨 UI/UX Philosophy
SentinelIQ is designed with a premium, terminal-inspired dark mode aesthetic. Utilizing vibrant accents, glassmorphism, and micro-animations, the interface provides a deeply engaging and data-rich user experience that visualizes complex AI operations elegantly.

---
<div align="center">
  <i>Built for the future of decentralized financial intelligence.</i>
</div>
