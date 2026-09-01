# SentinelIQ / TRIPWIRE Architecture

This document describes the implemented technical architecture for SentinelIQ.

## System Overview

The system is designed as a split full-stack application, ensuring that UI components render at 60fps via Next.js and Framer Motion, while the heavy orchestration logic runs independently on a Node.js/Express backend engine.

```mermaid
graph TD
    A[User Frontend - Next.js :3000] -->|HTTP POST /api/analyze| B(Backend Orchestrator - Express :3001)
    
    subgraph Dynamic Engine
    B --> C{Intent Classifier}
    C -->|STOCK_ANALYSIS| D[Actionable Pipeline]
    C -->|PORTFOLIO_RISK| E[Risk Pipeline]
    C -->|MARKET_EVENT| F[Informational Pipeline]
    end

    subgraph Agents & Intelligence Nodes
    D --> G(Signal Core)
    D --> H(Fundamental Evidence)
    D --> I(Portfolio Risk)
    D --> J(Behavioral Mirror)
    D --> K(Adversarial Agent)
    D --> P(Quantum Predictor)
    D --> L(Adjudicator)
    end

    subgraph Neural ML Microservice
    B -->|Async POST /predict| ML[Python FastAPI Microservice :8000]
    ML -->|Safetensors Inference| BERT[DistilBERT Sequence Classifier]
    BERT -->|Softmax Probabilities & Sentiment| B
    end

    subgraph Context & Personalization
    I --> M[(User Risk & Portfolio DB)]
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
The orchestrator simulates parallel agent execution, tracks their internal status (bullish/bearish/caution), penalizes the confidence score based on disagreements and personal context, calls the ML microservice for quantitative inference, and finally compiles the **Decision Contract**.

## 4. Machine Learning Microservice (`ml_model/main.py`)
A dedicated Python FastAPI microservice providing real-time neural Natural Language Processing (NLP) inference:
- **Model**: `distilbert-base-uncased` fine-tuned Sequence Classification model loaded from `model.safetensors`.
- **Classification**: Generates 3-class sentiment distributions (`Negative`, `Neutral`, `Positive`) alongside confidence percentage scores.
- **Port & Protocol**: Runs on `http://localhost:8000/predict` via Uvicorn/FastAPI.
- **Resilience**: Features non-blocking async fetching from the Node.js backend with graceful fallback if the microservice is offline or initializing.

## 5. UI/UX Layer (`frontend/src/app/page.tsx` & `frontend/src/app/evaluate/page.tsx`)
The frontend is completely state-based (SPA architecture). 
- **Animation Pipeline**: A sequential stagger animation visually explains the multi-agent and ML inference orchestration process in real-time.
- **Dynamic War Room**: The UI dynamically iterates through whatever agents the backend actually triggered (including the ML Sentiment Engine), mapping their status to colors and rendering their dissenting opinions.
- **Neural Sentiment Telemetry**: Renders live probability distributions and sentiment badges directly within the Decision Contract.
