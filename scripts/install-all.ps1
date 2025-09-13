# PowerShell script to install all dependencies
Write-Host "Installing All Dependencies..." -ForegroundColor Yellow
Write-Host "=================================" -ForegroundColor Yellow

# Install root dependencies
Write-Host "Installing root dependencies..." -ForegroundColor Green
npm install

# Install frontend dependencies
Write-Host "Installing frontend dependencies..." -ForegroundColor Blue
Set-Location -Path "frontend"
npm install

# Install backend dependencies
Write-Host "Installing backend dependencies..." -ForegroundColor Green
Set-Location -Path "..\backend"
npm install

# Return to root
Set-Location -Path ".."

Write-Host "All dependencies installed successfully!" -ForegroundColor Green
Write-Host "You can now run: npm start" -ForegroundColor Cyan