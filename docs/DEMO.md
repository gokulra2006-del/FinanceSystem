# How to Test SentinelIQ (Judge Test Guide)

This guide provides the shortest path to experiencing the core innovations of SentinelIQ.

## STEP 1: Start the Engines
Ensure both the frontend and backend are running locally:
- Backend: `http://localhost:3001` (run `node index.js`)
- Frontend: `http://localhost:3000` (run `npm run dev`)

## STEP 2: Test the Dynamic Question Engine
On the main **Decision Firewall** page, you can type arbitrary financial questions to test the intent classification system.

**Test Informational Routing:**
1. Type: *"Am I overexposed to the tech sector?"*
2. Click **Analyze Decision**.
3. **Observe**: The resulting contract is marked as `[ANALYZE]` and the Agent War Room correctly spun up only a subset of agents (e.g., Portfolio Risk, Macro & Sector) rather than all 7.

## STEP 3: Test Dynamic Personalization
The exact same evidence yields completely different reasoning based on the investor's context.

1. At the bottom left of the sidebar, select the user **Priya (Growth)**.
2. Type: *"Should I buy TSLA because earnings are accelerating?"*
3. Click **Analyze Decision**.
4. **Observe**: The Decision Confidence is extremely high. The Portfolio Risk agent marks it as a `bullish` acceptable allocation.
5. Now, switch the user to **Arjun (Conservative)**.
6. Ask the exact same question.
7. **Observe**: The system recognizes Arjun already has 41% tech exposure. The Confidence score drops drastically. The Portfolio Risk agent turns `bearish`, warning of severe limits violation. A new purple box appears stating: **"Why your answer is different: System applied a penalty due to your Conservative profile risk limits."**

## STEP 4: The 60-Second "Wow Moment" (Tripwires)
The most important feature of SentinelIQ is its ability to invalidate its own reasoning.

1. Ensure the user is set to **Arjun**.
2. Click the **Load Demo Thesis** button below the input box to ensure perfectly deterministic data.
3. Click **Analyze Decision**.
4. Wait for the pipeline animation to finish and the **Decision Contract** to appear.
5. Notice the **Tripwires** section. The system has created a falsification condition: *"Earnings Growth Miss < 8%"*, and it is currently `ARMED` (Safe).
6. **Trigger the Falsification**: Look at the bottom right corner of the screen. Click the **Floating Settings Gear Icon** to open the hidden Demo Control Center.
7. Click **"Fire Revenue Tripwire"**.
8. **Observe**: The entire Decision Contract turns red and is marked `VOID`. The system explicitly revokes its own decision because the foundational evidence (Revenue Growth) fell below the machine-checkable threshold.
