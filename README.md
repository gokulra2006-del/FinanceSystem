# TRIPWIRE

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

Most platforms stop at analysis. Tripwire introduces the **Decision Lifecycle**:

`Question` -> `Evidence` -> `Independent Agents` -> `Disagreement` -> `Adversarial Challenge` -> `Personal Context` -> `Decision Contract` -> `Falsification Conditions` -> `Monitoring` -> **`Self-Revocation`**

## Signature Innovation: The Tripwire

A **TRIPWIRE** is a machine-checkable condition derived from evidence that can invalidate an investment thesis.

For example:

1. **THESIS**: *"Company X will maintain strong earnings growth."*
2. **EVIDENCE**: Latest filing supports a 10% growth assumption.
3. **TRIPWIRE**: If future reported growth falls below 8%, the thesis is challenged.

When a Tripwire fires, it does not just send a generic alert. It explicitly says:

**"The evidence that supported your original reasoning has been invalidated."**

The system then autonomously voids the original investment contract.

## Why Tripwire is Different

| Feature                     | Generic Financial Chatbot     | Tripwire                                             |
| :-------------------------- | :---------------------------- | :--------------------------------------------------- |
| **Evidence Grounding**      | Predicts/Hallucinates         | Cites specific, traceable tiers of evidence          |
| **Agent Specialization**    | Single generic prompt         | 7 specialized, independent agents                    |
| **Explicit Falsifiability** | "Yes Men" that agree with you | Generates strict Tripwire falsification conditions   |
| **Self-Revocation**         | None                          | Automatically voids its own past decisions           |
| **Personalization**         | Generic output                | Adapts analysis based on portfolio risk profile      |
| **Behavioral Analysis**     | None                          | Analyzes your past trades for cognitive biases       |
| **Stress Testing**          | Limited                       | Tests whether decisions survive changed assumptions  |

## The System Can Admit It Was Wrong

Tripwire handles the entire decision lifecycle. Instead of overwriting history, past decisions are preserved as immutable contracts.

- **ACTIVE**: The decision is supported by current evidence.
- **TRIPWIRE FIRED**: Contradictory evidence detected.
- **ORIGINAL THESIS VOID**: The contract is automatically revoked.
- **NEW ANALYSIS**: The system generates a superseding reasoning tree.

## We Would Rather Say "I Don't Know"

If required evidence is unavailable, or data streams degrade, the system does not invent an answer.

It explicitly returns **CANNOT CONCLUDE** and lists the exact missing evidence, the affected reasoning, and the impact on system confidence.

## Dynamic Question Engine

Tripwire handles arbitrary natural language.

Try asking:

- *"Should I buy TSLA?"*
- *"Am I overexposed to technology?"*
- *"Why did the market fall today?"*
- *"Is my emergency fund sufficient to cover three to six months of living expenses?"*

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

## AI Sentiment & Intent Inference (ML Microservice)
 
Tripwire is enhanced by a custom **Machine Learning Microservice** running locally via FastAPI. When a user submits a financial thesis, the system performs live Natural Language Processing (NLP) inference to evaluate intent and confidence.
 
* **Architecture**: A specialized `safetensors` model utilizing a `BertForSequenceClassification` pipeline.
* **Function**: It classifies user text inputs into distinct categories (Negative, Neutral, Positive) alongside exact percentage-based confidence scores.
* **Integration**: The AI prediction is asynchronously fetched by the backend Orchestrator and permanently attached to the user's Decision Contract as an independent, quantitative "second opinion" on their thesis. 
 
This creates a hybrid intelligence system where LLM-driven multi-agent research is verified against a dedicated quantitative classification model.

---

## Decision Stress Testing

Tripwire does not only ask whether a decision is correct today.

It asks:

> **"Would this decision survive if one important assumption changed?"**

The Decision Stress Test Engine creates controlled hypothetical scenarios and evaluates how resilient the decision is.

It can test scenarios such as:

- Revenue growth falling below the Tripwire threshold.
- A critical regulatory filing being superseded.
- Behavioral risk increasing because of FOMO.
- Important evidence disappearing.
- Debt burden increasing.
- Changes in portfolio exposure.

Each scenario produces a measurable outcome:

- **SURVIVES**
- **THESIS BREAKS**

The system also calculates:

- Worst-case confidence
- Confidence drawdown
- Fragility Index
- Robustness classification
- Survival conditions
- Non-breaking factors

Importantly, hypothetical stress tests do **not** mutate the active decision contract.

## Evidence Challenge Engine

Tripwire actively searches for the strongest evidence that could disprove the current decision.

Instead of asking only:

> *"Why is this decision correct?"*

the system asks:

> **"What is the strongest evidence that could prove this decision wrong?"**

This creates an adversarial layer that challenges the evidence supporting the thesis.

## Continuous Thesis Tracking

Tripwire maintains historical versions of decisions.

When new evidence arrives, the system compares the current evaluation against the previous thesis.

It can detect:

- No material change
- Confidence changes
- Evidence quality changes
- Verdict changes
- New contradictions
- Tripwire violations

The system preserves the decision history instead of silently replacing previous reasoning.

## Behavioral Mirror

Tripwire treats the investor's own behavior as another risk factor.

The MIRROR engine analyzes historical decision patterns and identifies behavioral risks such as:

- FOMO
- Momentum chasing
- Confirmation bias
- Repeated high-risk entries

The **Personal Adversary** can challenge a decision when the current trade resembles problematic historical behavior.

This means Tripwire evaluates both:

**"Is this decision supported by the market?"**

and

**"Is this decision consistent with the investor's own behavioral history?"**

## Actual Decision Answers

Tripwire provides a direct answer to the exact question being evaluated.

For supported binary questions, the Decision Contract prominently displays:

```text
ANSWER: YES
