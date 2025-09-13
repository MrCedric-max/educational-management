# Backup script for the Educational Management System
$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$backupDir = "backups/backup_$timestamp"

Write-Host "💾 Creating project backup..." -ForegroundColor Yellow
Write-Host "Backup directory: $backupDir" -ForegroundColor Cyan

# Create backup directory
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null

# Copy essential files and directories
$itemsToBackup = @(
    "frontend",
    "backend", 
    "scripts",
    "package.json",
    "package-lock.json",
    "README.md",
    "*.bat"
)

foreach ($item in $itemsToBackup) {
    if (Test-Path $item) {
        Copy-Item -Path $item -Destination $backupDir -Recurse -Force
        Write-Host "✅ Backed up: $item" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Not found: $item" -ForegroundColor Yellow
    }
}

# Create backup info file
$backupInfo = @"
Backup created: $timestamp
Project: Educational Management System
Backup location: $backupDir

Contents:
- frontend/ (React application)
- backend/ (Express server)
- scripts/ (PowerShell scripts)
- package.json (Root configuration)
- *.bat (Windows batch files)

To restore:
1. Copy contents from $backupDir to project root
2. Run: npm run install:all
3. Run: .\quick-start.bat
"@

$backupInfo | Out-File -FilePath "$backupDir/BACKUP_INFO.txt" -Encoding UTF8

Write-Host "`nBackup completed successfully!" -ForegroundColor Green
Write-Host "Backup location: $backupDir" -ForegroundColor Cyan
Write-Host "To restore: Copy contents from backup directory to project root" -ForegroundColor Yellow
