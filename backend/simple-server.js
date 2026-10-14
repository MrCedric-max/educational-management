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

// Authentication & JWT Security Middleware
const {
  generateToken,
  comparePassword,
  hashPassword,
  authenticateToken,
  requireRole,
  optionalAuth
} = require('./middleware/authMiddleware');

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

// -----------------------------------------------------------------------------
// Authentication Routes (JWT & Password Hashing)
// -----------------------------------------------------------------------------

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
    if (user && comparePassword(password, user.password_hash)) {
      const token = generateToken(user);
      res.json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        },
        token
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
    const hashedPassword = hashPassword(password);
    const newUser = db.createUser({ name, email, password: hashedPassword, role });
    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: newUser,
      token
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Current Authenticated User Profile (JWT Protected)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({
    success: true,
    user: req.user
  });
});

// -----------------------------------------------------------------------------
// Core Domain Entities (Database Backed)
// -----------------------------------------------------------------------------

// Users endpoint
app.get('/api/users', optionalAuth, (req, res) => {
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

// Schools endpoint
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

// Classes endpoint
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

// Students endpoint
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

// Attendance endpoints
app.get('/api/attendance', optionalAuth, (req, res) => {
  try {
    const { classId, date } = req.query;
    const result = db.getAttendance({ classId, date });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/attendance', optionalAuth, (req, res) => {
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

// Grades & Gradebook endpoints
app.get('/api/grades', optionalAuth, (req, res) => {
  try {
    const { classId, subjectId, term } = req.query;
    const result = db.getGrades({ classId, subjectId, term });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/grades', optionalAuth, (req, res) => {
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

// Timetable endpoints
app.get('/api/timetables', (req, res) => {
  try {
    const { classId, teacherId } = req.query;
    const result = db.getTimetables({ classId, teacherId });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.post('/api/timetables', optionalAuth, (req, res) => {
  try {
    const newSlot = db.createTimetableSlot(req.body);
    res.status(201).json({ success: true, data: newSlot, message: 'Timetable slot created' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Report Cards endpoint
app.get('/api/report-cards', optionalAuth, (req, res) => {
  try {
    const { classId, studentId, term } = req.query;
    const result = db.getReportCards({ classId, studentId, term });
    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Admin Protected Analytics Endpoint
app.get('/api/admin/metrics', authenticateToken, requireRole(['ADMIN', 'SCHOOL_ADMIN', 'SUPER_ADMIN']), (req, res) => {
  try {
    const users = db.getUsers();
    const schools = db.getSchools();
    const classes = db.getClasses();
    const students = db.getStudents();
    res.json({
      success: true,
      metrics: {
        totalUsers: users.length,
        totalSchools: schools.length,
        totalClasses: classes.length,
        totalStudents: students.length,
        serverUptime: process.uptime()
      }
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
