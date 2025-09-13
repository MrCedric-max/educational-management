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
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
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
  { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' }
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

server.listen(PORT, () => {
  console.log(`🚀 Enhanced Production Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔧 API test: http://localhost:${PORT}/api/test`);
  console.log(`👥 Users: http://localhost:${PORT}/api/users`);
  console.log(`🏫 Schools: http://localhost:${PORT}/api/schools`);
  console.log(`🔐 Auth login: http://localhost:${PORT}/api/auth/login`);
  console.log(`📝 Auth register: http://localhost:${PORT}/api/auth/register`);
});