@echo off
echo 🚀 Educational Management System - Quick Start
echo ==============================================

echo.
echo 🔍 Validating setup...
powershell -File scripts/validate-setup.ps1

echo.
echo 📦 Installing dependencies...
call npm run install:all

echo.
echo 🚀 Starting both servers...
start "Backend Server" cmd /k "cd backend && node simple-server.js"
timeout /t 3 /nobreak >nul
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ✅ Both servers started!
echo 📱 Frontend: http://localhost:3000
echo 🔧 Backend: http://localhost:3001
echo.
echo Press any key to close this window...
pause >nul



