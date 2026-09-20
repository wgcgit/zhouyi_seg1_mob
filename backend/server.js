const express = require('express');
const cors = require('cors');
const paipanRouter = require('./routes/paipan');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API 路由
app.use('/api', paipanRouter);

// 前端静态文件服务（支持 API 请求代理到后端）
app.use(express.static(path.join(__dirname, '../frontend')));

// 所有其他请求返回 index.html（SPA 支持）
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`周易之易服务运行在 http://localhost:${PORT}`);
});
