# Alcovia Intervention Engine

## Overview
This is a prototype of the Alcovia Intervention Engine, a closed-loop system connecting a Student App, Backend Server, and Automation Workflow.

## Tech Stack
- **Backend**: Node.js, Express, Sequelize, MySQL, Socket.io
- **Frontend**: React Native (Expo Web)
- **Automation**: n8n

## Setup Instructions

### Backend
1. Navigate to `alcovia-backend`.
2. Install dependencies: `npm install`.
3. Configure `.env` with your MySQL credentials.
4. Run the server: `npm start` (or `npm run dev` for nodemon).

### Frontend
1. Navigate to `alcovia-frontend`.
2. Install dependencies: `npm install`.
3. Run the web app: `npm run web`.

### Automation (n8n)
1. Import `n8n/workflow.json` into your n8n instance.
2. Configure the Webhook and Email nodes.
3. Ensure the backend `N8N_WEBHOOK_URL` matches your n8n webhook URL.

## The "Chaos" Component (Fail-Safe)
**Problem**: What if the Mentor doesn't reply for 12 hours?

**Solution**:
To prevent indefinite lockout, I propose a **Time-Based Escalation & Auto-Unlock** mechanism.

1. **Scheduled Job (Cron)**: The backend will run a cron job every hour to check for students in "Needs Intervention" state for > 12 hours.
2. **Escalation**: If a student is stuck, the system first sends an urgent email to a "Head Mentor".
3. **Auto-Unlock**: If no action is taken after 14 hours (2 hour grace period after escalation), the system automatically unlocks the student with a generic "Review Pending" status, allowing them to continue learning while flagging the incident for administrative review.

**Implementation**:
- Use `node-cron` in the backend.
- Query `DailyLog` or `Student` table for `updatedAt` < (now - 12 hours) AND status = 'Needs Intervention'.
- Update status to 'On Track' (or special 'Probation') and emit `unlock` socket event.

## Bonus Features Implemented
- **Real-Time Magic**: Used Socket.io for instant unlocking without page refresh.
- **Cheater Detection**: Frontend detects tab switching via `visibilitychange` event and logs a penalty (simulated).
