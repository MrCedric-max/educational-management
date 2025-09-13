# Educational Management System - Backend API

This is the backend API server for the Educational Management System, built with Express.js and WebSocket support.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (optional, for production)

### Installation

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the setup script:**
   ```bash
   node scripts/setup.js
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

The server will start on `http://localhost:3001`

## 📁 Project Structure

```
backend/
├── routes/           # API route handlers
├── middleware/       # Custom middleware
├── models/          # Database models
├── controllers/     # Business logic
├── utils/           # Utility functions
├── config/          # Configuration files
├── scripts/         # Setup and migration scripts
├── server.js        # Main server file
└── package.json     # Dependencies and scripts
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Schools
- `GET /api/schools` - Get all schools
- `GET /api/schools/:id` - Get school by ID
- `POST /api/schools` - Create new school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Classes
- `GET /api/classes` - Get all classes
- `GET /api/classes/:id` - Get class by ID
- `POST /api/classes` - Create new class
- `PUT /api/classes/:id` - Update class
- `DELETE /api/classes/:id` - Delete class

### Students
- `GET /api/students` - Get all students
- `GET /api/students/:id` - Get student by ID
- `POST /api/students` - Create new student
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `POST /api/quizzes` - Create new quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz
- `POST /api/quizzes/:id/submit` - Submit quiz

### Notifications
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read
- `POST /api/notifications` - Create notification

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/activity` - Get recent activity

### Files
- `POST /api/files/upload` - Upload file
- `DELETE /api/files/:id` - Delete file
- `PUT /api/files/:id/metadata` - Update file metadata

## 🔌 WebSocket Events

The server supports real-time communication via WebSocket:

### Connection
```javascript
const socket = io('ws://localhost:3001/ws');

// Authenticate
socket.emit('authenticate', 'your-jwt-token');

// Join room (e.g., school-specific updates)
socket.emit('join_room', 'school-1');
```

### Events
- `notification` - Real-time notifications
- `activity_update` - Activity feed updates
- `user_status` - User online/offline status
- `system_alert` - System-wide alerts
- `quiz_update` - Quiz-related updates
- `lesson_update` - Lesson plan updates
- `message` - Direct messages

## 🛠️ Development

### Environment Variables
Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:3000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=educational_management
DB_USER=postgres
DB_PASSWORD=password

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=1h

# WebSocket
WS_URL=ws://localhost:3001/ws

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,ppt,pptx,jpg,jpeg,png,gif,mp4,mp3
```

### Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations

## 🔒 Security Features

- **JWT Authentication** - Secure token-based authentication
- **Rate Limiting** - Prevent API abuse
- **CORS Protection** - Configured for frontend domain
- **Helmet** - Security headers
- **Input Validation** - Request validation and sanitization
- **Password Hashing** - bcrypt for secure password storage

## 📊 Monitoring

- **Health Check** - `GET /health` endpoint
- **Request Logging** - Morgan HTTP request logger
- **Error Handling** - Centralized error handling middleware
- **WebSocket Monitoring** - Connection status tracking

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure reverse proxy (nginx)
5. Enable HTTPS
6. Set up monitoring and logging

### Docker Support
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note:** This is a development setup. For production deployment, additional security measures and database configuration are required.




