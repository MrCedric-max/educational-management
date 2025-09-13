# Development Workflow Guide

## 🚀 Starting the System

### **Method 1: Batch Files (RECOMMENDED)**
```bash
# Start both servers
.\start-both.bat

# Or start individually
.\start-backend.bat
.\start-frontend.bat
```

### **Method 2: PowerShell Scripts**
```powershell
# Start both servers
powershell -File scripts/start-both.ps1

# Or start individually
powershell -File scripts/start-backend-absolute.ps1
powershell -File scripts/start-frontend-absolute.ps1
```

### **Method 3: NPM Commands**
```bash
# Start both servers
npm start

# Or start individually
npm run start:backend
npm run start:frontend
```

## 🔧 Development Process

### **Before Starting Development:**
1. ✅ Check if servers are already running
2. ✅ Verify directory structure is correct
3. ✅ Ensure all dependencies are installed
4. ✅ Test backend API endpoints
5. ✅ Test frontend React app

### **During Development:**
1. ✅ Make changes in appropriate directory (frontend/ or backend/)
2. ✅ Test changes immediately
3. ✅ Use proper file encoding (UTF-8)
4. ✅ Follow naming conventions
5. ✅ Keep frontend and backend separate

### **After Development:**
1. ✅ Test both servers work together
2. ✅ Verify API communication
3. ✅ Check for any error messages
4. ✅ Document any new procedures

## 🚨 Troubleshooting Checklist

### **If Backend Won't Start:**
1. Check if port 3001 is available
2. Verify backend/simple-server.js exists
3. Run `cd backend && node simple-server.js`
4. Check for missing dependencies

### **If Frontend Won't Start:**
1. Check if port 3000 is available
2. Verify frontend/package.json is valid
3. Run `cd frontend && npm start`
4. Check for JSON syntax errors

### **If Both Won't Start:**
1. Use batch files instead of npm commands
2. Check PowerShell execution policy
3. Verify all file paths are correct
4. Restart command prompt/PowerShell



