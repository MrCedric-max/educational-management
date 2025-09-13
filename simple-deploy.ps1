# Simple Deploy - Minimal approach to get your app running
Write-Host "🚀 Simple Deploy Starting..." -ForegroundColor Green

# Step 1: Start backend only (it's already working)
Write-Host "🖥️ Starting backend server..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Desktop\ppje\backend"

# Kill any existing node processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start backend in background
Start-Process powershell -ArgumentList "-Command", "Set-Location 'c:\Users\User\Desktop\ppje\backend'; node simple-server.js" -WindowStyle Minimized

# Step 2: Wait and test
Start-Sleep -Seconds 3
Write-Host "🧪 Testing backend..." -ForegroundColor Cyan

try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Backend Health: $($health.status)" -ForegroundColor Green
    
    $users = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method GET -TimeoutSec 5
    Write-Host "✅ Users API: $($users.data.Count) users" -ForegroundColor Green
    
    Write-Host ""
    Write-Host "🎉 Backend is LIVE and working!" -ForegroundColor Green
    Write-Host "📋 Available endpoints:" -ForegroundColor Yellow
    Write-Host "   Health: http://localhost:3001/health" -ForegroundColor White
    Write-Host "   Users: http://localhost:3001/api/users" -ForegroundColor White
    Write-Host "   Schools: http://localhost:3001/api/schools" -ForegroundColor White
    Write-Host "   Login: http://localhost:3001/api/auth/login" -ForegroundColor White
    
} catch {
    Write-Host "❌ Backend test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "📱 Your API is ready for frontend integration!" -ForegroundColor Cyan
