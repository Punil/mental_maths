import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';
import QRCode from 'qrcode';
import { db } from './db.js';
import { generateCustomAssignment } from './curriculumGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors());
app.use(express.json());

// Helper to determine local Wi-Fi / LAN IP
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

const localIp = getLocalIp();
const lanUrl = `http://${localIp}:${PORT}`;

// Broadcast helper for WebSockets
function broadcastToParents(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.isParent) {
      client.send(message);
    }
  });
}

function broadcastToAll(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// WebSocket Connection Handling
wss.on('connection', ws => {
  ws.isParent = false;
  ws.childId = null;

  ws.on('message', messageRaw => {
    try {
      const msg = JSON.parse(messageRaw);

      if (msg.type === 'register_parent') {
        ws.isParent = true;
        // Send currently active sessions immediately
        ws.send(JSON.stringify({
          type: 'live_sessions_sync',
          sessions: db.getLiveSessions()
        }));
      } else if (msg.type === 'child_progress') {
        ws.childId = msg.childId;
        const session = db.updateLiveSession({
          childId: msg.childId,
          childName: msg.childName || 'Child',
          assignmentId: msg.assignmentId,
          assignmentTitle: msg.assignmentTitle,
          grade: msg.grade,
          currentIndex: msg.currentIndex,
          totalQuestions: msg.totalQuestions,
          currentQuestionText: msg.currentQuestionText,
          correctCount: msg.correctCount,
          wrongCount: msg.wrongCount,
          timeElapsedSeconds: msg.timeElapsedSeconds
        });
        broadcastToParents({
          type: 'live_session_update',
          session
        });
      } else if (msg.type === 'child_finish') {
        if (msg.childId) {
          db.clearLiveSession(msg.childId);
          broadcastToParents({
            type: 'live_session_ended',
            childId: msg.childId
          });
        }
      }
    } catch (e) {
      console.error('WS parse error:', e);
    }
  });

  ws.on('close', () => {
    if (ws.childId) {
      db.clearLiveSession(ws.childId);
      broadcastToParents({
        type: 'live_session_ended',
        childId: ws.childId
      });
    }
  });
});

// REST API Endpoints

// 1. Network Info & QR Code
app.get('/api/network', async (req, res) => {
  try {
    const qrDataUrl = await QRCode.toDataURL(lanUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#1e293b',
        light: '#ffffff'
      }
    });
    res.json({
      localIp,
      port: PORT,
      lanUrl,
      qrDataUrl
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
});

// 2. Profiles & Security
app.get('/api/profiles', (req, res) => {
  res.json(db.getProfiles());
});

app.post('/api/verify-pin', (req, res) => {
  const { pin } = req.body;
  const valid = db.verifyParentPin(pin);
  res.json({ valid });
});

// 3. Assignments
app.get('/api/assignments', (req, res) => {
  const { grade } = req.query;
  const list = db.getAssignments(grade);
  res.json(list);
});

app.get('/api/assignments/:id', (req, res) => {
  const assignment = db.getAssignmentById(req.params.id);
  if (!assignment) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  res.json(assignment);
});

app.post('/api/assignments', (req, res) => {
  const assignment = generateCustomAssignment(req.body);
  db.addAssignment(assignment);
  broadcastToAll({
    type: 'assignment_created',
    assignment
  });
  res.status(201).json(assignment);
});

app.delete('/api/assignments/:id', (req, res) => {
  const removed = db.deleteAssignment(req.params.id);
  if (!removed) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  res.json({ success: true, removed });
});

// 4. Submissions & Scoring
app.get('/api/submissions', (req, res) => {
  const { childId, grade } = req.query;
  const submissions = db.getSubmissions(childId, grade);
  res.json(submissions);
});

app.post('/api/submissions', (req, res) => {
  const {
    assignmentId,
    assignmentTitle,
    grade,
    childId,
    childName,
    answers, // [{ questionId, prompt, operand1, operator, operand2, correctAnswer, childAnswer, isCorrect, timeSpentSeconds }]
    totalTimeSeconds
  } = req.body;

  let correctCount = 0;
  answers.forEach(a => {
    if (a.isCorrect) correctCount++;
  });

  const totalQuestions = answers.length;
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const averageTimePerQuestion = totalQuestions > 0 ? Math.round((totalTimeSeconds / totalQuestions) * 10) / 10 : 0;

  const submission = {
    id: `sub-${Date.now()}`,
    assignmentId,
    assignmentTitle,
    grade: Number(grade),
    childId: childId || 'guest',
    childName: childName || 'Alex',
    completedAt: new Date().toISOString(),
    score: correctCount,
    totalQuestions,
    accuracy,
    totalTimeSeconds,
    averageTimePerQuestion,
    answers
  };

  db.addSubmission(submission);
  db.clearLiveSession(childId);

  // Notify parents of completed assignment in real time
  broadcastToParents({
    type: 'child_submission',
    submission
  });

  res.status(201).json(submission);
});

// 5. Active Live Sessions
app.get('/api/live-sessions', (req, res) => {
  res.json(db.getLiveSessions());
});

// Serve frontend build if dist directory exists
const clientDistPath = path.join(__dirname, '..', 'dist');
app.use(express.static(clientDistPath));

app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, err => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
        <head><title>Mental Maths Server</title></head>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1>Mental Maths API is Running!</h1>
          <p>Local Wi-Fi Address: <strong>${lanUrl}</strong></p>
          <p>Vite development server is running or client build is in progress.</p>
        </body>
        </html>
      `);
    }
  });
});

// Start Server
server.listen(PORT, HOST, async () => {
  console.log(`\n========================================================`);
  console.log(`🚀 Mental Maths Web App Server Running!`);
  console.log(`📡 Local Host:       http://localhost:${PORT}`);
  console.log(`📱 Wi-Fi Device URL: ${lanUrl}`);
  console.log(`========================================================\n`);

  try {
    const qrTerminal = await QRCode.toString(lanUrl, { type: 'terminal', small: true });
    console.log(`Scan this QR Code with your Tablet / Phone camera:\n`);
    console.log(qrTerminal);
  } catch (e) {
    // Ignore terminal QR render fallback
  }
});
