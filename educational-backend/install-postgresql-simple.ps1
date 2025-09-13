# Simple PostgreSQL Installation Script
Write-Host "PostgreSQL Installation Script" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "This script requires Administrator privileges." -ForegroundColor Red
    Write-Host "Please run PowerShell as Administrator and try again." -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Starting PostgreSQL installation..." -ForegroundColor Yellow

# Download PostgreSQL installer
$postgresUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.1-1-windows-x64.exe"
$installerPath = "$env:TEMP\postgresql-installer.exe"

Write-Host "Downloading PostgreSQL installer..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $postgresUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "Download completed!" -ForegroundColor Green
} catch {
    Write-Host "Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "Installing PostgreSQL..." -ForegroundColor Yellow
Write-Host "This will take a few minutes. Please wait..." -ForegroundColor Yellow

# Run installer with silent mode
$installArgs = @(
    "--mode", "unattended",
    "--superpassword", "password",
    "--servicename", "postgresql",
    "--serviceaccount", "postgres",
    "--servicepassword", "password",
    "--serverport", "5432",
    "--enable_acls", "0",
    "--unattendedmodeui", "none"
)

try {
    $process = Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -PassThru
    if ($process.ExitCode -eq 0) {
        Write-Host "PostgreSQL installation completed!" -ForegroundColor Green
    } else {
        Write-Host "Installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add PostgreSQL to PATH
Write-Host "Adding PostgreSQL to PATH..." -ForegroundColor Yellow
$postgresBinPath = "C:\Program Files\PostgreSQL\16\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$postgresBinPath*") {
    $newPath = $currentPath + ";" + $postgresBinPath
    [Environment]::SetEnvironmentVariable("PATH", $newPath, "Machine")
    Write-Host "PostgreSQL added to PATH!" -ForegroundColor Green
} else {
    Write-Host "PostgreSQL already in PATH!" -ForegroundColor Green
}

# Clean up
Remove-Item $installerPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "PostgreSQL installation completed!" -ForegroundColor Green
Write-Host "Database: educational_system" -ForegroundColor White
Write-Host "User: admin" -ForegroundColor White
Write-Host "Password: password" -ForegroundColor White
Write-Host "Port: 5432" -ForegroundColor White
Write-Host ""
Write-Host "Please restart your terminal to use PostgreSQL commands." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to continue"











