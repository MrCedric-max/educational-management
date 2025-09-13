# Validation script to check system setup
Write-Host "Validating Educational Management System Setup..." -ForegroundColor Yellow
Write-Host "=================================================" -ForegroundColor Yellow

$errors = @()
$warnings = @()

# Check if required directories exist
Write-Host "Checking directory structure..." -ForegroundColor Cyan

$requiredDirs = @("frontend", "backend", "scripts")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "Directory exists: $dir" -ForegroundColor Green
    } else {
        $errors += "Missing directory: $dir"
        Write-Host "Missing directory: $dir" -ForegroundColor Red
    }
}

# Check if required files exist
Write-Host "Checking required files..." -ForegroundColor Cyan

$requiredFiles = @(
    "frontend/package.json",
    "frontend/src/App.tsx",
    "backend/simple-server.js",
    "backend/package.json",
    "start-backend.bat",
    "start-frontend.bat",
    "start-both.bat"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "File exists: $file" -ForegroundColor Green
    } else {
        $errors += "Missing file: $file"
        Write-Host "Missing file: $file" -ForegroundColor Red
    }
}

# Check JSON syntax
Write-Host "Checking JSON syntax..." -ForegroundColor Cyan

$jsonFiles = @("package.json", "frontend/package.json", "backend/package.json")
foreach ($file in $jsonFiles) {
    if (Test-Path $file) {
        try {
            $json = Get-Content $file -Raw | ConvertFrom-Json
            Write-Host "Valid JSON: $file" -ForegroundColor Green
        } catch {
            $errors += "Invalid JSON in $file"
            Write-Host "Invalid JSON in $file" -ForegroundColor Red
        }
    }
}

# Check if ports are available
Write-Host "Checking port availability..." -ForegroundColor Cyan

$ports = @(3000, 3001)
foreach ($port in $ports) {
    $connection = Test-NetConnection -ComputerName localhost -Port $port -InformationLevel Quiet
    if ($connection) {
        $warnings += "Port $port is in use"
        Write-Host "Port $port is in use" -ForegroundColor Yellow
    } else {
        Write-Host "Port $port is available" -ForegroundColor Green
    }
}

# Summary
Write-Host "Validation Summary:" -ForegroundColor Yellow
Write-Host "===================" -ForegroundColor Yellow

if ($errors.Count -eq 0) {
    Write-Host "No critical errors found!" -ForegroundColor Green
} else {
    Write-Host "Found $($errors.Count) critical errors:" -ForegroundColor Red
    foreach ($error in $errors) {
        Write-Host "  $error" -ForegroundColor Red
    }
}

if ($warnings.Count -gt 0) {
    Write-Host "Found $($warnings.Count) warnings:" -ForegroundColor Yellow
    foreach ($warning in $warnings) {
        Write-Host "  $warning" -ForegroundColor Yellow
    }
}

if ($errors.Count -eq 0) {
    Write-Host "System is ready for development!" -ForegroundColor Green
} else {
    Write-Host "Please fix the errors before proceeding." -ForegroundColor Red
}