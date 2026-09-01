<div align="center">
  <img src="frontend/public/logo.png" alt="SentinelIQ" width="120" />
  <h1>SentinelIQ</h1>
  <p><strong>Multi-agent financial intelligence dashboard</strong></p>
</div>

SentinelIQ runs a panel of specialized LLM agents over a portfolio. They argue,
stress-test positions, flag cognitive biases in the user's own trading history,
and hold risky trades for review before they go through. The premise: a single
model scoring a trade hides its blind spots, but a panel of agents with different
mandates surfaces disagreement worth paying attention to.

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

## How it works

Each incoming thesis is fanned out to the agent panel in parallel. Every agent
returns an independent call plus its reasoning; the backend reconciles these into
a consensus verdict but keeps dissenting opinions attached rather than averaging
them away. The decision firewall sits between this verdict and trade execution,
running the stress-test pass before anything is allowed through.

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

## Notes & limitations

- Alpha Vantage's free tier caps at 25 requests/day, so historical series are
  cached after first fetch.
- Agent calls are fanned out in parallel; a full war-room round takes roughly a
  few seconds on the 8B model and longer on 70B.
- If the agent panel splits without a clear majority, the consensus call defaults
  to the most conservative (Risk Analyst) position rather than forcing a tie-break.
- No persistence layer yet — portfolio and trade history reset on backend restart.

## Status

Active side project / hackathon build, not production-hardened. Treat trade
interception as a demo of the concept, not a substitute for real risk controls.

## License

MIT
