# PostgreSQL Installation Script for Windows
# This script will download and install PostgreSQL with the required configuration

Write-Host "🚀 Starting PostgreSQL Installation..." -ForegroundColor Green

# Check if running as administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script requires Administrator privileges. Please run PowerShell as Administrator." -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# PostgreSQL version and download URL
$postgresVersion = "16.1"
$postgresUrl = "https://get.enterprisedb.com/postgresql/postgresql-16.1-1-windows-x64.exe"
$installerPath = "$env:TEMP\postgresql-installer.exe"

Write-Host "📥 Downloading PostgreSQL $postgresVersion..." -ForegroundColor Yellow
try {
    Invoke-WebRequest -Uri $postgresUrl -OutFile $installerPath -UseBasicParsing
    Write-Host "✅ Download completed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Download failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "🔧 Installing PostgreSQL..." -ForegroundColor Yellow
Write-Host "This may take a few minutes. Please wait..." -ForegroundColor Yellow

# Silent installation parameters
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
        Write-Host "✅ PostgreSQL installation completed!" -ForegroundColor Green
    } else {
        Write-Host "❌ Installation failed with exit code: $($process.ExitCode)" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
} catch {
    Write-Host "❌ Installation failed: $($_.Exception.Message)" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Add PostgreSQL to PATH
Write-Host "🔧 Adding PostgreSQL to PATH..." -ForegroundColor Yellow
$postgresBinPath = "C:\Program Files\PostgreSQL\16\bin"
$currentPath = [Environment]::GetEnvironmentVariable("PATH", "Machine")
if ($currentPath -notlike "*$postgresBinPath*") {
    [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$postgresBinPath", "Machine")
    Write-Host "✅ PostgreSQL added to PATH!" -ForegroundColor Green
} else {
    Write-Host "✅ PostgreSQL already in PATH!" -ForegroundColor Green
}

# Create database and user
Write-Host "🗄️ Creating database and user..." -ForegroundColor Yellow

# Set PGPASSWORD environment variable
$env:PGPASSWORD = "password"

try {
    # Create database
    & "C:\Program Files\PostgreSQL\16\bin\createdb.exe" -U postgres educational_system
    Write-Host "✅ Database 'educational_system' created!" -ForegroundColor Green
    
    # Create user
    & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "CREATE USER admin WITH PASSWORD 'password';"
    Write-Host "✅ User 'admin' created!" -ForegroundColor Green
    
    # Grant privileges
    & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE educational_system TO admin;"
    & "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres -c "ALTER USER admin CREATEDB;"
    Write-Host "✅ Privileges granted!" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Database setup failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "You may need to manually create the database and user." -ForegroundColor Yellow
}

# Clean up installer
Remove-Item $installerPath -Force -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "🎉 PostgreSQL installation completed!" -ForegroundColor Green
Write-Host "📋 Summary:" -ForegroundColor Cyan
Write-Host "   • PostgreSQL 16 installed" -ForegroundColor White
Write-Host "   • Database: educational_system" -ForegroundColor White
Write-Host "   • User: admin" -ForegroundColor White
Write-Host "   • Password: password" -ForegroundColor White
Write-Host "   • Port: 5432" -ForegroundColor White
Write-Host ""
Write-Host "🔄 Please restart your terminal/PowerShell to use PostgreSQL commands." -ForegroundColor Yellow
Write-Host ""

Read-Host "Press Enter to continue"











