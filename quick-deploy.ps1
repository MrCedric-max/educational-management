# Quick Deploy Script - Bypasses common issues
Write-Host "🚀 Quick Deploy - Educational Management System" -ForegroundColor Green
Write-Host "===============================================" -ForegroundColor Yellow

# Step 1: Clean and reset frontend dependencies
Write-Host "🧹 Cleaning frontend dependencies..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Desktop\ppje\frontend"
if (Test-Path "node_modules") {
    Write-Host "   Removing locked node_modules..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force "node_modules" -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 2
}

# Step 2: Fresh install with cache clear
Write-Host "📦 Installing fresh dependencies..." -ForegroundColor Cyan
npm cache clean --force
npm install --no-optional --legacy-peer-deps

# Step 3: Build production frontend
Write-Host "🏗️ Building production frontend..." -ForegroundColor Cyan
npm run build

# Step 4: Start backend server
Write-Host "🖥️ Starting backend server..." -ForegroundColor Cyan
Set-Location "c:\Users\User\Desktop\ppje\backend"
Start-Process powershell -ArgumentList "-Command", "node simple-server.js" -WindowStyle Minimized

# Step 5: Wait and test
Start-Sleep -Seconds 5
Write-Host "🧪 Testing backend connection..." -ForegroundColor Cyan
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET -TimeoutSec 10
    Write-Host "✅ Backend is running!" -ForegroundColor Green
    Write-Host "   Status: $($response.status)" -ForegroundColor White
} catch {
    Write-Host "❌ Backend connection failed" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}

Write-Host ""
Write-Host "🎉 Quick Deploy Complete!" -ForegroundColor Green
Write-Host "📋 Your app is ready at:" -ForegroundColor Yellow
Write-Host "   Frontend Build: c:\Users\User\Desktop\ppje\frontend\build" -ForegroundColor White
Write-Host "   Backend API: http://localhost:3001" -ForegroundColor White
Write-Host "   Health Check: http://localhost:3001/health" -ForegroundColor White
