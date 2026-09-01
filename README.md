```markdown
<div align="center">
  <img src="frontend/public/logo.png" alt="SentinelIQ" width="120" />
  <h1>SentinelIQ</h1>
  <p><strong>Multi-agent financial intelligence dashboard</strong></p>
</div>

SentinelIQ runs a panel of specialized LLM agents over a portfolio. They argue,
stress-test positions, flag cognitive biases in the user's own trading history,
and hold risky trades for review before they go through.

## Features

**Agent war room** — Risk Analyst, Momentum Trader, and Value Investor agents
evaluate a thesis independently, then reconcile into a consensus call with the
dissents preserved.

**Decision firewall** — Intercepts a trade before execution, runs it through
stress scenarios, and surfaces the bias patterns behind it.

**Live telemetry** — Real-time quotes and historical series feeding the dashboard.

**Behavioral mirror** — Profiles trading history for recurring biases such as
loss aversion and momentum chasing.

**Regret ledger** — Point-in-time state replay, so past decisions can be re-run
against what was actually knowable then.

## Stack

| Layer | Tools |
|---|---|
| Frontend | Next.js, React, TailwindCSS, Recharts, Framer Motion |
| Backend | Node.js, Express |
| Inference | Groq (Llama 3.3 70B, Llama 3.1 8B) |
| Market data | Finnhub (quotes), Alpha Vantage (time series) |

## Setup

```bash
git clone https://github.com/your-username/FinanceIntelligenceSystem.git
cd FinanceIntelligenceSystem
```

Create `backend/.env`:

```env
GROQ_API_KEY=
ALPHAVANTAGE_API_KEY=
FINNHUB_API_KEY=
```

Install:

```bash
cd backend && npm install
cd ../frontend && npm install
```

Run in two terminals:

```bash
cd backend && node index.js     # http://localhost:3001
cd frontend && npm run dev      # http://localhost:3000
```

## Notes

Alpha Vantage's free tier caps at 25 requests/day, so historical series are
cached after first fetch. Agent calls are fanned out in parallel; a full war-room
round takes roughly a few seconds on the 8B model and longer on 70B.

## License

MIT
```

Two things worth adding when you have them: a screenshot or GIF of the war room under the title (it's the single highest-value thing in a hackathon README), and real numbers in the Notes section instead of my placeholders. Also drop the "built for the future of decentralized financial intelligence" line — it promises something the project doesn't do.
