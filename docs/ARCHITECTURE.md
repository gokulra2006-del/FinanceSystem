# SentinelIQ / TRIPWIRE Architecture

This document describes the implemented technical architecture for SentinelIQ.

## System Overview

The system is designed as a split full-stack application, ensuring that UI components render at 60fps via Next.js and Framer Motion, while the heavy orchestration logic runs independently on a Node.js/Express backend engine.

```mermaid
graph TD
    A[User Frontend - Next.js] -->|HTTP POST| B(Backend Orchestrator - Express)
    
    subgraph Dynamic Engine
    B --> C{Intent Classifier}
    C -->|STOCK_ANALYSIS| D[Actionable Pipeline]
    C -->|PORTFOLIO_RISK| E[Risk Pipeline]
    C -->|MARKET_EVENT| F[Informational Pipeline]
    end

    subgraph Agents
    D --> G(Signal Core)
    D --> H(Fundamental Evidence)
    D --> I(Portfolio Risk)
    D --> J(Behavioral Mirror)
    D --> K(Adversarial Agent)
    D --> L(Adjudicator)
    end

    subgraph Context & Personalization
    I --> M[(Mock User DB)]
    J --> M
    end

    L --> N[Decision Contract Synthesis]
    N --> O[Falsification Generation / Tripwires]
    O --> A
```

## 1. Intent Classifier (`backend/engine/classifier.js`)
Unlike a standard chatbot that passes the entire string to a generic prompt, SentinelIQ uses a routing engine to determine *which* specialized agents should be spun up based on keywords and patterns in the user's natural language input.

## 2. Personalization Layer (`backend/engine/context.js`)
Before agents execute, the orchestrator pulls the authenticated user's portfolio and risk metrics. This ensures that the exact same market evidence results in a personalized confidence score and blast radius warning.

## 3. The Orchestrator (`backend/engine/orchestrator.js`)
The orchestrator simulates parallel agent execution, tracks their internal status (bullish/bearish/caution), penalizes the confidence score based on disagreements and personal context, and finally compiles the **Decision Contract**.

## 4. UI/UX Layer (`frontend/src/app/page.tsx`)
The frontend is completely state-based (SPA architecture). 
- **Animation Pipeline**: A sequential stagger animation visually explains the agent orchestration process to the user while the backend computes the result.
- **Dynamic War Room**: The UI dynamically iterates through whatever agents the backend actually triggered, mapping their status to colors and rendering their dissenting opinions.
