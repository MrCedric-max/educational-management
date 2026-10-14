const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const { createServer } = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

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
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Compression and logging
app.use(compression());
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mock data
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'teacher' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'student' },
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { id: 4, name: 'Test User', email: 'test@example.com', role: 'teacher' }
];

const mockSchools = [
  { id: 1, name: 'Central High School', location: 'New York' },
  { id: 2, name: 'Westside Elementary', location: 'California' }
];

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

// Users endpoint
app.get('/api/users', (req, res) => {
  res.json({
    success: true,
    data: mockUsers,
    count: mockUsers.length
  });
});

// Schools endpoint
app.get('/api/schools', (req, res) => {
  res.json({
    success: true,
    data: mockSchools,
    count: mockSchools.length
  });
});

// In-memory data store for feature enhancements
const mockAttendance = [
  { id: 'att_1', classId: 'class_1', date: '2024-10-14', studentId: 's1', studentName: 'Emma Johnson', status: 'present' },
  { id: 'att_2', classId: 'class_1', date: '2024-10-14', studentId: 's2', studentName: 'Michael Brown', status: 'present' },
  { id: 'att_3', classId: 'class_1', date: '2024-10-14', studentId: 's3', studentName: 'Sophia Davis', status: 'late', timeIn: '08:15', reason: 'Traffic' },
  { id: 'att_4', classId: 'class_1', date: '2024-10-14', studentId: 's4', studentName: 'James Wilson', status: 'absent', reason: 'Flu' }
];

const mockGrades = [
  { id: 'g_1', classId: 'class_1', subjectId: 'math', term: 'Term 1', studentId: 's1', studentName: 'Emma Johnson', ca1: 16, ca2: 15, exam: 17, remark: 'Excellent' },
  { id: 'g_2', classId: 'class_1', subjectId: 'math', term: 'Term 1', studentId: 's2', studentName: 'Michael Brown', ca1: 12, ca2: 13, exam: 11, remark: 'Satisfactory' }
];

const mockTimetables = [
  { id: 's1', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 1, periodNumber: 1, startTime: '07:30', endTime: '08:25', room: 'Room 101' },
  { id: 's2', classId: 'class_1', className: 'Form 3A', subjectId: 'math', subjectName: 'Mathematics', teacherId: 't1', teacherName: 'Mr. Cedric Mbida', dayOfWeek: 1, periodNumber: 2, startTime: '08:25', endTime: '09:20', room: 'Room 101' },
  { id: 's3', classId: 'class_1', className: 'Form 3A', subjectId: 'eng', subjectName: 'English Language', teacherId: 't6', teacherName: 'Ms. Clara Fon', dayOfWeek: 1, periodNumber: 3, startTime: '09:20', endTime: '10:15', room: 'Room 101' }
];

// Attendance endpoints
app.get('/api/attendance', (req, res) => {
  const { classId, date } = req.query;
  let result = mockAttendance;
  if (classId) result = result.filter(a => a.classId === classId);
  if (date) result = result.filter(a => a.date === date);
  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/attendance', (req, res) => {
  const { records } = req.body;
  if (Array.isArray(records)) {
    mockAttendance.push(...records);
  } else if (req.body && req.body.studentId) {
    mockAttendance.push(req.body);
  }
  res.status(201).json({ success: true, message: 'Attendance recorded successfully' });
});

// Grades & Gradebook endpoints
app.get('/api/grades', (req, res) => {
  const { classId, subjectId, term } = req.query;
  let result = mockGrades;
  if (classId) result = result.filter(g => g.classId === classId);
  if (subjectId) result = result.filter(g => g.subjectId === subjectId);
  if (term) result = result.filter(g => g.term === term);
  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/grades', (req, res) => {
  const { grades } = req.body;
  if (Array.isArray(grades)) {
    mockGrades.push(...grades);
  } else if (req.body) {
    mockGrades.push(req.body);
  }
  res.status(201).json({ success: true, message: 'Grades saved successfully' });
});

// Timetable endpoints
app.get('/api/timetables', (req, res) => {
  const { classId, teacherId } = req.query;
  let result = mockTimetables;
  if (classId) result = result.filter(t => t.classId === classId);
  if (teacherId) result = result.filter(t => t.teacherId === teacherId);
  res.json({ success: true, count: result.length, data: result });
});

app.post('/api/timetables', (req, res) => {
  const newSlot = { id: 'slot_' + Date.now(), ...req.body };
  mockTimetables.push(newSlot);
  res.status(201).json({ success: true, data: newSlot, message: 'Timetable slot created' });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Mock authentication
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password123') {
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
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, password, role } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  // Mock registration
  const newUser = {
    id: mockUsers.length + 1,
    name,
    email,
    role: role || 'student'
  };
  
  mockUsers.push(newUser);
  
  res.status(201).json({
    success: true,
    message: 'Registration successful',
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    },
    token: 'mock-jwt-token-' + Date.now()
  });
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