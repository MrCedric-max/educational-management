# Educational Management System

A comprehensive monorepo containing both frontend and backend applications for educational management.

## 🆕 School Manager — the `School_Manager` workbook as a web app

The **[`school-manager/`](school-manager/README.md)** folder contains a complete, self-contained web app that
reproduces the École AZOBE `School_Manager.xlsx` workbook: registration, calendar, roll call, weekly controls,
daily performance, monthly & term marks, class reports, official A4 report cards and statistics — bilingual
(EN/FR), with a one-click import of the workbook.

```bash
cd school-manager && npm install && npm run build && npm start   # → http://localhost:4000
```

On Windows, simply double-click `school-manager/start.bat`. See [school-manager/README.md](school-manager/README.md).

## 🚨 IMPORTANT: Avoiding Common Issues

This project has been configured to prevent common development issues. **ALWAYS** follow these guidelines:

### ✅ **DO:**
- Use batch files (`start-both.bat`, `start-backend.bat`, `start-frontend.bat`) for starting servers
- Keep frontend and backend completely separate
- Run validation script before starting development: `powershell -File scripts/validate-setup.ps1`
- Use `quick-start.bat` for first-time setup

### ❌ **DON'T:**
- Mix frontend and backend files in the same directory
- Use Unix syntax (`&&`, `rm -rf`) in Windows environments
- Modify the root `package.json` workspace configuration
- Run commands from wrong directories

## 🏗️ Project Structure

```
ppje/
├── frontend/          # React TypeScript application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Express.js API server
│   ├── simple-server.js
│   └── package.json  # Backend dependencies
├── scripts/          # Development scripts
└── package.json      # Workspace root
```

## 🚀 Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0

### Installation
```bash
# Install all dependencies
npm run install:all
```

### Development
```bash
# Start both frontend and backend
npm start

# Or start individually
npm run start:frontend  # Frontend only (port 3000)
npm run start:backend   # Backend only (port 3001)
```

### Build
```bash
# Build frontend for production
npm run build
```

## 📱 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health
- **API Test**: http://localhost:3001/api/test

## 🔧 Available Scripts

- `npm start` - Start both frontend and backend
- `npm run start:frontend` - Start frontend only
- `npm run start:backend` - Start backend only
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies
- `npm run clean` - Clean all node_modules

## 🏛️ Architecture

### Frontend (React + TypeScript)
- Modern React with hooks
- TypeScript for type safety
- Tailwind CSS for styling
- React Router for navigation
- Proxy configuration for API calls

### Backend (Express.js)
- RESTful API endpoints
- WebSocket support
- Security middleware (Helmet, CORS)
- Rate limiting
- Health monitoring

## 🛠️ Development

The monorepo structure provides:
- **Clean separation** of frontend and backend
- **No port conflicts** - each service runs on its own port
- **Shared dependencies** - common packages at root level
- **Easy development** - one command starts everything
- **Simple deployment** - clear structure for production

## 📦 Dependencies

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router DOM
- Lucide React (icons)

### Backend
- Express.js
- Socket.io
- Helmet (security)
- CORS
- Morgan (logging)
- Compression
- Rate limiting

## 🚀 Production Deployment

1. Build the frontend: `npm run build`
2. Deploy backend to your server
3. Serve frontend build files through backend or CDN
4. Configure environment variables
5. Set up database connections

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test both frontend and backend
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
