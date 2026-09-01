# SENTINELIQ
### The Financial Decision Firewall
 
> *"An AI financial intelligence system that doesn't just make a decision — it defines what would prove that decision wrong and can revoke it when the evidence changes."*
 
## The Problem
 
Retail investors don't suffer from a lack of information; they suffer from a lack of **accountability**. 
 
When an investor forms a belief (e.g., *"This stock will grow because of new management"*), that belief rarely has:
- Explicit invalidation conditions
- An expiration date
- A mechanism for self-correction
 
Better information alone does not produce better decisions. We needed a system that protects investors from their own obsolete reasoning.
 
## Our Core Insight
 
**The problem is not only how investors form beliefs. It is how those beliefs survive after the evidence changes.**
 
Most platforms stop at analysis. SentinelIQ introduces the **Decision Lifecycle**:
 
`Question` -> `Evidence` -> `Independent Agents` -> `Disagreement` -> `Adversarial Challenge` -> `Personal Context` -> `Decision Contract` -> `Falsification Conditions` -> `Monitoring` -> **`Self-Revocation`**
 
## Signature Innovation: The Tripwire
 
A **TRIPWIRE** is a machine-checkable condition derived from evidence that can invalidate an investment thesis.
 
For example:
1. **THESIS**: *"Company X will maintain strong earnings growth."*
2. **EVIDENCE**: Latest filing supports a 10% growth assumption.
3. **TRIPWIRE**: If future reported growth falls below 8%, the thesis is challenged.
 
When a Tripwire fires, it does not just send a generic alert. It explicitly says: **"The evidence that supported your original reasoning has been invalidated."** The system then autonomously voids the original investment contract.
 
## Why SentinelIQ is Different
 
| Feature | Generic Financial Chatbot | SentinelIQ |
| :--- | :--- | :--- |
| **Evidence Grounding** | Predicts/Hallucinates | Cites specific, traceable tiers of evidence |
| **Agent Specialization** | Single generic prompt | 7 specialized, independent agents |
| **Explicit Falsifiability** | "Yes Men" that agree with you | Generates strict Tripwire falsification conditions |
| **Self-Revocation** | None | Automatically voids its own past decisions |
| **Personalization** | Generic output | Adapts analysis based on portfolio risk profile |
| **Behavioral Analysis** | None | Analyzes your past trades for cognitive biases |
 
## The System Can Admit It Was Wrong
 
SentinelIQ handles the entire decision lifecycle. Instead of overwriting history, past decisions are preserved as immutable contracts.
- **ACTIVE**: The decision is supported by current evidence.
- **TRIPWIRE FIRED**: Contradictory evidence detected.
- **ORIGINAL THESIS VOID**: The contract is automatically revoked.
- **NEW ANALYSIS**: The system generates a superseding reasoning tree.
 
## We Would Rather Say "I Don't Know"
 
If required evidence is unavailable, or data streams degrade, the system does not invent an answer. It explicitly returns **CANNOT CONCLUDE** and lists the exact missing evidence, the affected reasoning, and the impact on system confidence.
 
## Dynamic Question Engine
 
SentinelIQ handles arbitrary natural language. Try asking:
- *"Should I buy TSLA?"*
- *"Am I overexposed to technology?"*
- *"Why did the market fall today?"*
 
The **Orchestrator** dynamically spins up *only* the relevant agents needed for the specific intent.
 
## Personalization: You Are The Risk
 
The exact same market data yields materially different answers for different users. 
- Ask a high-risk question as **Arjun (Conservative)**, and the system issues a severe Portfolio Risk warning.
- Ask the same question as **Priya (Growth)**, and the system approves the thesis. 
The reasoning adapts to *you*, not just the market.
 
## The Multi-Agent Architecture
 
The system orchestrates a diverse panel of specialized intelligence nodes:
- **Signal Core**: Momentum and quantitative data.
- **Fundamental Evidence**: SEC filings and financials.
- **Macro & Sector**: Environment and rotation.
- **Portfolio Risk**: User-specific exposure limits.
- **Behavioral Mirror**: Analyzes user trading history for cognitive bias (e.g., FOMO).
- **Adversarial Agent**: A dedicated Red Team built specifically to destroy the thesis.
- **Adjudicator**: Synthesizes conflicting evidence.
 
---
 
## How to Test SentinelIQ (Judge Test Guide)
 
This project consists of a Next.js frontend and an Express/Node.js backend.
 
### Setup
1. **Backend**: `cd backend && npm install && node index.js` (Runs on port 3001)
2. **Frontend**: `cd frontend && npm install && npm run dev` (Runs on port 3000)
 
### The 60-Second "Wow" Moment (Demo Flow)
1. Open the UI at `http://localhost:3000`.
2. Notice the **User Profile Switcher** on the bottom left. Select **Arjun (Conservative)** and log in using the demo password.
3. In the Decision Firewall, click **"Load Demo Thesis"** and then **"Evaluate Thesis"**.
4. Watch the agents spin up. Notice the **Decision Contract** is created and **Tripwires** are armed. 
5. Look at the bottom right corner of the screen. Click the **Floating Settings Gear Icon** to open the hidden Demo Control Center.
6. Click **"Fire Revenue Tripwire"**.
7. Watch the system instantly **VOID** the contract, admitting its original thesis is no longer valid based on new simulated evidence!
 
---
 
## Technology Stack
 
- **Frontend**: Next.js, React, Tailwind v4, Framer Motion, Lucide React
- **Backend**: Node.js, Express
- **Engine**: Custom Dynamic Orchestrator (Intent Classification, Context Injection, Agent Synthesis)
- **Deployment**: Localhost (Designed for Vercel/Render)
 
---
 
*Instead of asking "What should I buy?", SentinelIQ asks: "What do I believe, why do I believe it, what would prove me wrong, and what should happen when that occurs?"*
