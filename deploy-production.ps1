# Production Deployment Script - Single Command Solution
param(
    [switch]$SkipBuild,
    [switch]$ForceClean
)

Write-Host "🚀 Production Deployment Starting..." -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Yellow

$projectRoot = "c:\Users\User\Desktop\ppje"
$frontendPath = Join-Path $projectRoot "frontend"
$backendPath = Join-Path $projectRoot "backend"
$buildPath = Join-Path $frontendPath "build"

# Kill any existing processes
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

if ($ForceClean) {
    Write-Host "🧹 Force cleaning all dependencies..." -ForegroundColor Yellow
    Remove-Item -Path (Join-Path $frontendPath "node_modules") -Recurse -Force -ErrorAction SilentlyContinue
    Remove-Item -Path (Join-Path $backendPath "node_modules") -Recurse -Force -ErrorAction SilentlyContinue
}

# Backend setup
Write-Host "🖥️ Setting up backend..." -ForegroundColor Cyan
Set-Location $backendPath
if (-not (Test-Path "node_modules")) {
    npm install --production
}

# Frontend setup and build
if (-not $SkipBuild) {
    Write-Host "⚛️ Building frontend..." -ForegroundColor Cyan
    Set-Location $frontendPath
    
    if (-not (Test-Path "node_modules") -or $ForceClean) {
        npm cache clean --force
        npm install --legacy-peer-deps
    }
    
    npm run build
    
    if (Test-Path $buildPath) {
        Write-Host "✅ Frontend build successful" -ForegroundColor Green
    } else {
        Write-Host "❌ Frontend build failed" -ForegroundColor Red
        exit 1
    }
}

# Start production server
Write-Host "🚀 Starting production server..." -ForegroundColor Cyan
Set-Location $backendPath

# Create production startup script
$startupScript = @"
const express = require('express');
const path = require('path');
const app = require('./simple-server');

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

console.log('🎉 Production server ready!');
console.log('📱 App: http://localhost:3001');
console.log('🔧 API: http://localhost:3001/api');
"@

$startupScript | Out-File -FilePath "production-server.js" -Encoding UTF8

# Start the server
node production-server.js

Write-Host "🎉 Deployment Complete!" -ForegroundColor Green
