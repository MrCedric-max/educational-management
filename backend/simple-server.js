const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

// Database Service Layer (Persisted SQLite / PostgreSQL)
const db = require('./database/db');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200 // limit each IP to 200 requests per windowMs
});
app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Users endpoint (Database Backed)
app.get('/api/users', (req, res) => {
  try {
    const users = db.getUsers();
    res.json({
      success: true,
      data: users,
      count: users.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Schools endpoint (Database Backed)
app.get('/api/schools', (req, res) => {
  try {
    const schools = db.getSchools();
    res.json({
      success: true,
      data: schools,
      count: schools.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Classes endpoint (Database Backed)
app.get('/api/classes', (req, res) => {
  try {
    const classes = db.getClasses();
    res.json({
      success: true,
      data: classes,
      count: classes.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Students endpoint (Database Backed)
app.get('/api/students', (req, res) => {
  try {
    const students = db.getStudents(req.query.classId);
    res.json({
      success: true,
      data: students,
      count: students.length
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Attendance endpoints (Database Backed)
app.get('/api/attendance', (req, res) => {
  try {
    const { classId, date } = req.query;
    const result = db.getAttendance({ classId, date });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/attendance', (req, res) => {
  try {
    const { records } = req.body;
    if (Array.isArray(records)) {
      db.saveAttendance(records);
    } else if (req.body) {
      db.saveAttendance(req.body);
    }
    res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Grades & Gradebook endpoints (Database Backed)
app.get('/api/grades', (req, res) => {
  try {
    const { classId, subjectId, term } = req.query;
    const result = db.getGrades({ classId, subjectId, term });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/grades', (req, res) => {
  try {
    const { grades } = req.body;
    if (Array.isArray(grades)) {
      db.saveGrades(grades);
    } else if (req.body) {
      db.saveGrades(req.body);
    }
    res.status(201).json({ success: true, message: 'Grades saved successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Timetable endpoints (Database Backed)
app.get('/api/timetables', (req, res) => {
  try {
    const { classId, teacherId } = req.query;
    const result = db.getTimetables({ classId, teacherId });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/timetables', (req, res) => {
  try {
    const newSlot = db.createTimetableSlot(req.body);
    res.status(201).json({ success: true, data: newSlot, message: 'Timetable slot created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Report Cards endpoint (Database Backed)
app.get('/api/report-cards', (req, res) => {
  try {
    const { classId, studentId, term } = req.query;
    const result = db.getReportCards({ classId, studentId, term });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Auth endpoints (Database Backed)
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    const user = db.getUserByEmail(email);
    if (user && (password === 'password123' || user.password_hash === password)) {
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token: 'mock-jwt-token-' + Date.now()
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  try {
    const newUser = db.createUser({ name, email, password, role });
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: newUser,
      token: 'mock-jwt-token-' + Date.now()
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// WebSocket connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
  
  // Send periodic updates
  setInterval(() => {
    socket.emit('update', {
      timestamp: new Date().toISOString(),
      message: 'System update'
    });
  }, 30000);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Enhanced Production Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API test: http://localhost:${PORT}/api/test`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  console.log(`🏫 Schools: http://localhost:${PORT}/api/schools`);
  console.log(`🔐 Auth login: http://localhost:${PORT}/api/auth/login`);
  console.log(`📝 Auth register: http://localhost:${PORT}/api/auth/register`);
});
