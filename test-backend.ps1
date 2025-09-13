# Test Backend - Simple working test
Write-Host "Testing Backend API..." -ForegroundColor Green

# Kill any existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

# Start backend
Set-Location "c:\Users\User\Desktop\ppje\backend"
Start-Process powershell -ArgumentList "-Command", "node simple-server.js" -WindowStyle Minimized

# Wait for startup
Start-Sleep -Seconds 3

# Test endpoints
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Health: $($health.status)" -ForegroundColor Green
    
    $users = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method GET
    Write-Host "✅ Users: $($users.data.Count) found" -ForegroundColor Green
    
    Write-Host "🎉 Backend is working!" -ForegroundColor Green
    Write-Host "API available at: http://localhost:3001" -ForegroundColor Cyan
    
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}
