# PowerShell script with absolute paths to start backend server
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
$projectRoot = Split-Path -Parent $scriptPath
$backendPath = Join-Path $projectRoot "backend"

Write-Host "🚀 Starting Backend Server..." -ForegroundColor Green
Write-Host "📁 Backend Path: $backendPath" -ForegroundColor Yellow

Set-Location -Path $backendPath
Write-Host "🔧 Starting Express server on port 3001..." -ForegroundColor Cyan
node simple-server.js



