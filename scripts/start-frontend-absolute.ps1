# PowerShell script with absolute paths to start frontend server
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath
$frontendPath = Join-Path $projectRoot "frontend"

Write-Host "🚀 Starting Frontend Server..." -ForegroundColor Blue
Write-Host "📁 Frontend Path: $frontendPath" -ForegroundColor Yellow

Set-Location -Path $frontendPath
Write-Host "⚛️ Starting React development server on port 3000..." -ForegroundColor Cyan
npm start



