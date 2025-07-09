# Fitness Activity Support Web Application - Claude Assistant Guide

## Project Overview
A personal web application that helps plan, track, and review weekly fitness activities (strength training and jogging). The app provides a chat-style interface powered by Azure OpenAI, scheduled notifications, and comprehensive tracking features.

**Target User**: Single authenticated user (the developer themself)

## Tech Stack
- **Frontend**: React 18 + Vite + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + TypeScript
- **LLM**: Azure OpenAI (GPT-4o or GPT-4o-mini)
- **Storage**: Local JSON files (`data/{yyyy-ww}.json`)
- **Scheduler**: node-cron
- **Package Manager**: npm (simplified structure)

## 📊 Current Progress Status (Updated: 2025-07-09)

### ✅ Completed Tasks
1. **構造の簡素化** - shared/パッケージを削除してbackend/src/types/に統合
2. **Workspace設定削除** - monorepo複雑性を解消し、シンプルな構造に変更
3. **依存関係安定化** - パッケージバージョンを安定版に固定
4. **TypeScript設定簡素化** - 複雑なパス解決を削除し、相対パス中心に
5. **WSL2最適化** - .npmrcでWSL2環境用の設定追加
6. **バックエンド動作確認** - シンプルサーバーが http://localhost:3001 で稼働中

### 🔧 動作確認済み
- ✅ バックエンドヘルスチェック: `curl http://localhost:3001/health`
- ✅ 依存関係インストール成功（backend, frontend）
- ✅ シンプルJavaScriptサーバー起動成功
- ✅ API構造準備完了（/api/chat, /api/plan, /api/status, /api/summary）

### ⚠️ 残り作業項目
1. **Azure OpenAI環境変数設定** - .envファイルの作成と設定
2. **フロントエンド起動テスト** - React + Viteの動作確認
3. **統合テスト** - フロントエンド↔バックエンド通信確認
4. **Azure OpenAI統合テスト** - 実際のLLM応答確認

## Development Commands (Updated)
```bash
# Install dependencies (simplified)
npm run install:all

# Start frontend (React + Vite)
npm run dev:frontend
# または cd frontend && npm run dev

# Start backend (Node.js)
npm run dev:backend  
# または cd backend && npm run dev

# Clean all dependencies
npm run clean

# Build
npm run build
```

## 🚀 アプリケーション起動手順 (WSL2環境)

### 📝 事前準備（初回のみ）
```bash
# 1. 環境変数設定
cp .env.example .env
# .envファイルでAzure OpenAI認証情報を設定

# 2. 依存関係インストール
npm run install:all
```

### 🔥 アプリケーション起動 (2つのターミナルが必要)

#### ターミナル1: バックエンド起動
```bash
cd /mnt/c/d/script/20250709_MUSULEApp/backend
npm run dev
# → http://localhost:3001 で稼働開始
```

#### ターミナル2: フロントエンド起動
```bash
cd /mnt/c/d/script/20250709_MUSULEApp/frontend
npm run dev
# → http://localhost:3000 で稼働開始
```

### 🌐 アクセス方法
- **フロントエンド**: http://localhost:3000
- **バックエンドAPI**: http://localhost:3001

### ⚡ 簡単起動スクリプト
```bash
# バックエンド起動（バックグラウンド）
cd backend && npm run dev &

# フロントエンド起動
cd frontend && npm run dev
```

### 🔧 WSL2設定済み
- Vite設定: `host: '0.0.0.0'` でWSL2からWindows側へアクセス可能
- ポート: 3000(frontend), 3001(backend)
- Azure OpenAI統合: 環境変数で設定済み

## Project Structure (Monorepo)
```
/
├── frontend/          # React + Vite app
│   ├── src/
│   │   ├── components/  # Chat UI components
│   │   ├── pages/       # App pages
│   │   ├── hooks/       # Custom React hooks
│   │   └── utils/       # Frontend utilities
│   ├── package.json
│   └── vite.config.ts
├── backend/           # Node.js Express API
│   ├── src/
│   │   ├── routes/      # API endpoints
│   │   ├── services/    # Business logic
│   │   ├── schedulers/  # Cron jobs
│   │   └── types/       # Backend types
│   ├── package.json
│   └── tsconfig.json
├── shared/            # Shared types and utilities
│   ├── src/
│   │   ├── types/       # Common type definitions
│   │   └── utils/       # Shared utilities
│   └── package.json
├── data/              # Local JSON data storage
│   └── {yyyy-ww}.json   # Weekly workout data
├── .env               # Environment variables
├── .env.example       # Environment template
└── package.json       # Root monorepo config
```

## Key Features
- **Chat-style UI**: Single-column interface with message bubbles
- **Azure OpenAI Integration**: Empathetic fitness assistant in Japanese
- **Workout Planning**: Free-text or structured input parsing
- **Progress Tracking**: ✅ done / ⏳ pending / ❌ missed status
- **Scheduled Notifications**: Weekly planning, mid-week check-ins, wrap-ups
- **Data Persistence**: Local JSON files with 52-week retention
- **Mobile-first Design**: Responsive with auto-scroll

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/chat` | Proxy to Azure OpenAI |
| PUT | `/api/plan` | Save workout plan |
| PATCH | `/api/status` | Update workout status |
| GET | `/api/summary/:week` | Get weekly report |

## Data Models
### WorkoutItem
```typescript
interface WorkoutItem {
  id: string;           // "tue-run-5k"
  date: string;         // "2025-07-15"
  type: "run" | "strength" | "other";
  detail: string;       // "5km easy pace"
  status: "pending" | "done" | "missed";
}
```

### WeeklyPlan
```typescript
interface WeeklyPlan {
  week: string;         // "2025-28"
  startDate: string;    // "2025-07-07"
  endDate: string;      // "2025-07-13"
  items: WorkoutItem[];
  createdAt: string;
  updatedAt: string;
}
```

## Notification Schedule
- **Monday 07:00**: Weekly planning prompt
- **Friday 12:00**: Mid-week check-in
- **Sunday 18:00**: Weekly wrap-up request

## Environment Variables
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

## Azure OpenAI System Prompt
```
You are an empathetic fitness assistant. You communicate in Japanese and help users plan and track their weekly fitness activities. Your role is to:
1. Parse user messages into structured workout plans
2. Provide encouragement and motivation
3. Remind users of remaining workouts
4. Generate weekly summaries
5. Always respond in a supportive, friendly tone
Timezone: Asia/Tokyo
```

## Development Notes
- **Language**: Primary interface in Japanese
- **Timezone**: All times in Asia/Tokyo
- **Data Retention**: 52 weeks, auto-purge older files
- **Performance**: First paint < 1s, LLM response ≤ 5s
- **Cost Target**: ≤ $5 USD/month (local development)

## User Flows
1. **Weekly Planning**: Monday notification → Chat interface → LLM parsing → JSON storage
2. **Mid-week Check-in**: Friday notification → Status update → Remaining items display
3. **Weekly Wrap-up**: Sunday notification → Results summary → Archive storage

## 🎯 Next Steps (次回再開時)

### 優先順位1: 環境変数設定
```bash
# 1. .envファイル作成
cp .env.example .env

# 2. Azure OpenAI情報を設定
# AZURE_OPENAI_API_KEY=your_actual_key
# AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

### 優先順位2: フロントエンド起動
```bash
cd frontend
npm run dev
# → http://localhost:3000 でアクセス確認
```

### 優先順位3: 統合テスト
```bash
# チャット機能のテスト例
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"今週ランニングします"}],"week":"2025-28"}'
```

## 🔧 現在の動作状況 (2025-07-09 Updated)
- ✅ **フロントエンド**: http://localhost:3000 (起動中)
- ✅ **バックエンド**: http://localhost:3001 (起動中)
- ✅ **Azure OpenAI**: 環境変数設定完了・統合テスト成功
- ✅ **WSL2対応**: Vite設定でWindows側からアクセス可能

## Getting Started (完全版)
1. ✅ 依存関係インストール完了
2. ✅ `.env.example` → `.env` 作成とAzure OpenAI設定完了
3. ✅ バックエンドサーバー起動完了
4. ✅ フロントエンド起動完了・WSL2対応済み
5. ✅ 統合テスト実行完了・正常動作確認

## Future Enhancements
- Graphs of weekly progress (Chart.js)
- Voice input on mobile (Web Speech API)
- Strava/Garmin integration
- Multi-user support