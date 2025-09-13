# PowerShell script to start frontend server
Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Blue
Write-Host "📁 Changing to frontend directory..." -ForegroundColor Yellow
Set-Location -Path "..\frontend"

Write-Host "⚛️ Starting React development server on port 3000..." -ForegroundColor Cyan
npm start



