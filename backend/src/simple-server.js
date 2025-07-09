const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());

// Mock chat endpoint
app.post('/api/chat', (req, res) => {
  const { messages, week } = req.body;
  
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({
      success: false,
      error: 'Messages array is required',
    });
  }

  const lastMessage = messages[messages.length - 1];
  const content = lastMessage.content.toLowerCase();
  
  let responseText = '';
  let parsedItems = [];

  if (content.includes('ランニング') || content.includes('走る') || content.includes('run')) {
    parsedItems.push({
      id: 'tue-run-5k',
      date: '2025-07-08',
      type: 'run',
      detail: '5km ランニング',
      status: 'pending',
    });
    responseText = '5kmランニングを計画に追加しました！頑張ってください！';
  } else if (content.includes('筋トレ') || content.includes('筋力') || content.includes('strength')) {
    parsedItems.push({
      id: 'thu-strength-bench',
      date: '2025-07-10',
      type: 'strength',
      detail: 'ベンチプレス 3セット',
      status: 'pending',
    });
    responseText = 'ベンチプレスを計画に追加しました！';
  } else if (content.includes('今週') || content.includes('計画') || content.includes('プラン')) {
    responseText = '今週のワークアウトプランを教えてください。例：\\n\\n- 火曜日に5kmランニング\\n- 木曜日に筋トレ（ベンチプレス）\\n- 土曜日に3kmジョギング\\n\\nのように具体的に教えてください！';
  } else {
    responseText = 'ワークアウトの内容を具体的に教えてください。ランニングや筋トレなど、どのような運動を予定していますか？';
  }

  const response = {
    success: true,
    data: {
      content: responseText,
      metadata: {
        type: 'plan',
        week,
        parsedItems: parsedItems.length > 0 ? parsedItems : undefined,
      },
    },
  };

  console.log('Chat request:', { lastMessage: lastMessage.content, week });
  console.log('Chat response:', responseText);
  
  res.json(response);
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

// Mock other endpoints
app.put('/api/plan', (req, res) => {
  console.log('Plan saved:', req.body);
  res.status(204).send();
});

app.patch('/api/status', (req, res) => {
  console.log('Status updated:', req.body);
  res.json({ success: true, message: 'Status updated' });
});

app.get('/api/summary/:week', (req, res) => {
  res.json({
    success: true,
    data: {
      week: req.params.week,
      totalWorkouts: 3,
      completedWorkouts: 1,
      missedWorkouts: 0,
      completionRate: 33.3,
      items: [],
    },
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running on http://localhost:${PORT}`);
  console.log(`📡 Health check: http://localhost:${PORT}/health`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
});