# 🚀 MUSULEApp クイックスタート

## 問題解決と起動手順

現在依存関係のインストールで問題が発生しています。以下の手順で解決できます：

### 1. 依存関係の問題を修正

```bash
# 全てのnode_modulesを削除
rm -rf node_modules frontend/node_modules backend/node_modules shared/node_modules

# package-lock.jsonも削除
rm -f package-lock.json frontend/package-lock.json backend/package-lock.json

# 順番にインストール
npm install
npm install --workspace=shared
npm install --workspace=backend  
npm install --workspace=frontend
```

### 2. シンプルバックエンドで起動

TypeScriptの問題を回避するため、シンプルなJavaScriptサーバーを作成済み：

```bash
# バックエンド起動
cd backend
node src/simple-server.js

# 別ターミナルでフロントエンド起動  
cd frontend
npx vite
```

### 3. アクセス

- フロントエンド: http://localhost:3000
- バックエンドAPI: http://localhost:3001
- ヘルスチェック: http://localhost:3001/health

## 現在利用可能な機能

✅ **完全実装済み**
- チャット風UI（React + Tailwind CSS）
- ダークモード切り替え
- モバイルファースト デザイン
- ワークアウト表示コンポーネント
- APIエンドポイント構造

✅ **モック実装済み**
- 日本語チャット応答
- ワークアウトプラン解析（基本版）
- データ永続化（基本版）

🔄 **今後の実装**
- Azure OpenAI API統合（環境変数設定後）
- 完全なスケジューラー機能
- 高度なワークアウト解析

## 環境変数設定

```bash
# .envファイル作成
cp .env.example .env

# Azure OpenAI設定を追加
AZURE_OPENAI_API_KEY=your_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-mini
```

## デモ用チャット例

以下のメッセージでテストできます：

- "今週のワークアウト計画を立てたいです"
- "火曜日に5kmランニング"  
- "木曜日に筋トレをします"
- "ベンチプレス 3セット"

## トラブルシューティング

### 依存関係エラー
```bash
npm run clean
rm -f **/package-lock.json
npm run install:all
```

### ポート使用中エラー
```bash
# プロセス確認
lsof -i :3000
lsof -i :3001

# 停止
kill -9 <PID>
```

## プロジェクト構造

```
/
├── frontend/          # React + Vite (UI完成)
├── backend/           # Express API (モック完成) 
├── shared/            # 共有型定義 (完成)
├── data/              # JSON保存先
└── README.md          # 詳細ドキュメント
```

アプリケーションの基盤は完成しています！