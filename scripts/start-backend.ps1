# PowerShell script to start backend server
Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host "📁 Changing to backend directory..." -ForegroundColor Yellow
Set-Location -Path "..\backend"

Write-Host "🔧 Starting Express server on port 3001..." -ForegroundColor Cyan
node simple-server.js



