# MUSULEApp - Fitness Activity Support Web Application

A personal web application that helps plan, track, and review weekly fitness activities with AI-powered chat interface.

## Quick Start

1. **Setup Environment Variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Azure OpenAI credentials
   ```

2. **Install Dependencies**
   ```bash
   npm run install:all
   ```

3. **Start Development Servers**
   ```bash
   npm run dev:all
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Project Structure

```
/
├── frontend/          # React + Vite + TypeScript + Tailwind
├── backend/           # Node.js + Express + TypeScript
├── shared/            # Shared types and utilities
├── data/              # Local JSON data storage
├── .env               # Environment variables
└── README.md          # This file
```

## Features

- **Chat Interface**: AI-powered conversation in Japanese
- **Workout Planning**: Parse natural language into structured plans
- **Progress Tracking**: Monitor workout completion status
- **Scheduled Notifications**: Weekly planning, mid-week check-ins, wrap-ups
- **Data Persistence**: Local JSON storage with 52-week retention
- **Mobile-First Design**: Responsive interface with dark mode

## Environment Variables

Required environment variables in `.env`:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/
AZURE_OPENAI_API_VERSION=2024-02-01
AZURE_OPENAI_DEPLOYMENT_NAME=your-deployment-name

# Application Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000
TZ=Asia/Tokyo
```

## Development Commands

```bash
# Install all dependencies
npm run install:all

# Start development servers
npm run dev:all          # Both frontend and backend
npm run dev              # Frontend only
npm run server           # Backend only

# Build
npm run build:all        # Build all packages
npm run build            # Build frontend only

# Clean
npm run clean            # Remove all node_modules

# Test
npm test                 # Run tests
```

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | Send message to AI assistant |
| PUT | `/api/plan` | Save workout plan |
| PATCH | `/api/status` | Update workout status |
| GET | `/api/summary/:week` | Get weekly summary |

## Data Models

### WorkoutItem
```typescript
interface WorkoutItem {
  id: string           // "tue-run-5k"
  date: string         // "2025-07-15"
  type: "run" | "strength" | "other"
  detail: string       // "5km easy pace"
  status: "pending" | "done" | "missed"
}
```

### WeeklyPlan
```typescript
interface WeeklyPlan {
  week: string         // "2025-28"
  startDate: string    // "2025-07-07"
  endDate: string      // "2025-07-13"
  items: WorkoutItem[]
  createdAt: string
  updatedAt: string
}
```

## Notification Schedule

- **Monday 07:00**: Weekly planning prompt
- **Friday 12:00**: Mid-week check-in
- **Sunday 18:00**: Weekly wrap-up request

## Development Notes

- **Language**: Primary interface in Japanese
- **Timezone**: All times in Asia/Tokyo
- **Data Retention**: 52 weeks, auto-purge older files
- **Performance**: First paint < 1s, LLM response ≤ 5s
- **Fallback**: Works without Azure OpenAI (mock responses)

## Troubleshooting

### Azure OpenAI Not Working
The app will fall back to mock responses if Azure OpenAI credentials are not configured or invalid.

### Port Already in Use
If ports 3000 or 3001 are already in use, modify the ports in:
- Frontend: `frontend/vite.config.ts`
- Backend: `.env` file (PORT variable)

### Build Errors
Try cleaning and reinstalling:
```bash
npm run clean
npm run install:all
```

## License

MIT