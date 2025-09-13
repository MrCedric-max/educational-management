@echo off
echo Starting Simple Frontend Server...
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Python HTTP server...
    cd frontend
    python -m http.server 3000
    goto :end
)

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using Node.js HTTP server...
    cd frontend
    npx http-server -p 3000 -o
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% == 0 (
    echo Using PHP HTTP server...
    cd frontend
    php -S localhost:3000
    goto :end
)

echo No suitable HTTP server found!
echo Please install Python, Node.js, or PHP
echo.
echo You can also manually open frontend/simple-index.html in your browser
echo and navigate to http://localhost:3001 to test the backend API
pause

:end


