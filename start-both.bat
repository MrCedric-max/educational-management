@echo off
echo Starting Educational Management System...
echo ===============================================

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && node simple-server.js"

timeout /t 3 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo Both servers started!
echo Frontend: http://localhost:3000
echo Backend: http://localhost:3001
echo.
echo Press any key to close this window...
pause >nul



