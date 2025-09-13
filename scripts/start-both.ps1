# PowerShell script to start both frontend and backend servers
Write-Host "🚀 Starting Educational Management System..." -ForegroundColor Yellow
Write-Host "===============================================" -ForegroundColor Yellow

# Start Backend Server in new window
Write-Host "🔧 Starting Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-File", "start-backend.ps1" -WindowStyle Normal

# Wait a moment for backend to start
Start-Sleep -Seconds 2

# Start Frontend Server in new window
Write-Host "⚛️ Starting Frontend Server..." -ForegroundColor Blue
Start-Process powershell -ArgumentList "-File", "start-frontend.ps1" -WindowStyle Normal

Write-Host "✅ Both servers started in separate windows!" -ForegroundColor Green
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend: http://localhost:3001" -ForegroundColor Cyan
Write-Host "Press any key to close this window..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
