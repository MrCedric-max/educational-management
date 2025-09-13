# PowerShell Integration Test Script
Write-Host "🧪 Testing Frontend-Backend Integration..." -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "Testing Health Check..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3001/health" -Method GET
    Write-Host "✅ Health Check: PASS" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor White
    Write-Host "   Timestamp: $($healthResponse.timestamp)" -ForegroundColor White
} catch {
    Write-Host "❌ Health Check: FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}
Write-Host ""

# Test 2: API Test Endpoint
Write-Host "Testing API Test Endpoint..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/test" -Method GET
    Write-Host "✅ API Test: PASS" -ForegroundColor Green
    Write-Host "   Success: $($testResponse.success)" -ForegroundColor White
    Write-Host "   Message: $($testResponse.message)" -ForegroundColor White
} catch {
    Write-Host "❌ API Test: FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}
Write-Host ""

# Test 3: Users API
Write-Host "Testing Users API..." -ForegroundColor Yellow
try {
    $usersResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/users" -Method GET
    Write-Host "✅ Users API: PASS" -ForegroundColor Green
    Write-Host "   Success: $($usersResponse.success)" -ForegroundColor White
    Write-Host "   Users Count: $($usersResponse.data.Count)" -ForegroundColor White
} catch {
    Write-Host "❌ Users API: FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}
Write-Host ""

# Test 4: Login API
Write-Host "Testing Login API..." -ForegroundColor Yellow
try {
    $loginBody = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body $loginBody -ContentType "application/json"
    Write-Host "✅ Login API: PASS" -ForegroundColor Green
    Write-Host "   Success: $($loginResponse.success)" -ForegroundColor White
    Write-Host "   User: $($loginResponse.user.name)" -ForegroundColor White
} catch {
    Write-Host "❌ Login API: FAIL" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor White
}
Write-Host ""

Write-Host "🎉 Integration test completed!" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Open http://localhost:3000 in your browser" -ForegroundColor White
Write-Host "2. Navigate to /api-test page" -ForegroundColor White
Write-Host "3. Click Run Integration Tests button" -ForegroundColor White
Write-Host "4. Review the detailed test results" -ForegroundColor White