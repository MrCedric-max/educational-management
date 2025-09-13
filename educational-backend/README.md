# Educational Management System - Backend API

A comprehensive backend API for managing educational institutions, students, teachers, and curriculum content with Cameroonian educational system integration.

## 🚀 Features

- **User Management**: Super Admin, School Admin, Teacher, Student, Parent roles
- **School Management**: Multi-school support with Anglophone/Francophone systems
- **Curriculum Integration**: Cameroonian primary school curriculum
- **Lesson Planning**: Auto-generated lesson plans with competence-based approach
- **Quiz System**: Auto-generated quizzes with real-time submission
- **Analytics**: Student progress tracking and school analytics
- **Real-time Features**: WebSocket support for live updates
- **File Management**: Upload and export functionality
- **Multi-language**: English/French support

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Authentication**: JWT + bcrypt
- **Real-time**: Socket.IO
- **Caching**: Redis
- **File Upload**: Multer
- **Email**: Nodemailer
- **Testing**: Jest + Supertest

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- Redis (optional, for caching)
- Git

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <repository-url>
cd educational-backend
npm install
```

### 2. Environment Setup

```bash
# Copy environment file
cp env.example .env

# Edit .env with your configuration
# Update DATABASE_URL, JWT_SECRET, etc.
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# (Optional) Seed database
npm run db:seed
```

### 4. Start Development Server

```bash
# Start with hot reload
npm run dev

# Or start production build
npm run build
npm start
```

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

```bash
# Start all services (PostgreSQL + Redis + App)
npm run docker:up

# Stop all services
npm run docker:down

# View logs
npm run docker:logs
```

### Manual Docker

```bash
# Build image
docker build -t educational-backend .

# Run container
docker run -p 5000:5000 educational-backend
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
All protected routes require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

#### Users
- `GET /api/users` - List users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user (Admin only)

#### Schools
- `GET /api/schools` - List schools (Super Admin only)
- `GET /api/schools/:id` - Get school by ID
- `POST /api/schools` - Create school (Super Admin only)
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school (Super Admin only)

#### Classes
- `GET /api/classes` - List classes
- `GET /api/classes/:id` - Get class by ID
- `GET /api/classes/:id/students` - Get class students
- `POST /api/classes` - Create class (Admin only)
- `PUT /api/classes/:id` - Update class (Admin only)
- `DELETE /api/classes/:id` - Delete class (Admin only)

#### Lesson Plans
- `GET /api/lesson-plans` - List lesson plans
- `GET /api/lesson-plans/:id` - Get lesson plan by ID
- `POST /api/lesson-plans` - Create lesson plan
- `POST /api/lesson-plans/generate` - Auto-generate lesson plan
- `PUT /api/lesson-plans/:id` - Update lesson plan
- `DELETE /api/lesson-plans/:id` - Delete lesson plan

#### Quizzes
- `GET /api/quizzes` - List quizzes
- `GET /api/quizzes/:id` - Get quiz by ID
- `GET /api/quizzes/:id/results` - Get quiz results
- `POST /api/quizzes` - Create quiz
- `POST /api/quizzes/generate` - Auto-generate quiz
- `POST /api/quizzes/:id/submit` - Submit quiz
- `PUT /api/quizzes/:id` - Update quiz
- `DELETE /api/quizzes/:id` - Delete quiz

#### Curriculum
- `GET /api/curriculum/:system/:level` - Get curriculum by system/level
- `GET /api/curriculum/subjects/:system/:level` - Get subjects
- `GET /api/curriculum/themes/:system/:level` - Get learning themes
- `GET /api/curriculum/search` - Search curriculum content

#### Analytics
- `GET /api/analytics/student/:id` - Student analytics
- `GET /api/analytics/class/:id` - Class analytics
- `GET /api/analytics/school/:id` - School analytics (Admin only)
- `GET /api/analytics/progress` - Progress insights
- `POST /api/analytics/reports/generate` - Generate reports

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📊 Database Schema

The database includes the following main entities:

- **Users**: Authentication and user management
- **Schools**: Educational institutions
- **Classes**: Class management
- **Students**: Student records
- **LessonPlans**: Lesson planning system
- **Quizzes**: Quiz management and attempts
- **ProgressData**: Student progress tracking
- **AttendanceRecords**: Attendance management
- **Messages**: Communication system
- **Notifications**: System notifications
- **Reports**: Generated reports
- **SchoolAnalytics**: School performance data

## 🔧 Development

### Project Structure

```
src/
├── controllers/     # API route handlers
├── models/         # Database models (Prisma)
├── routes/         # API routes
├── middleware/     # Custom middleware
├── services/       # Business logic
├── utils/          # Helper functions
├── config/         # Configuration files
└── index.ts        # Application entry point
```

### Adding New Features

1. **Database**: Update `prisma/schema.prisma`
2. **Migration**: Run `npm run db:migrate`
3. **Controller**: Create controller in `src/controllers/`
4. **Routes**: Add routes in `src/routes/`
5. **Middleware**: Add middleware if needed
6. **Tests**: Write tests in `tests/`

## 🚀 Deployment

### Environment Variables

Required environment variables:

```bash
NODE_ENV=production
PORT=5000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
REDIS_URL=redis://host:port
CORS_ORIGIN=https://your-frontend-domain.com
```

### Production Build

```bash
npm run build
npm start
```

### Docker Production

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic CRUD operations
- Authentication system
- Cameroonian curriculum integration
- Auto lesson plan generation
- Auto quiz generation
- Real-time features
- Analytics and reporting













