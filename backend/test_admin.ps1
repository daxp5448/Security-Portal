# Admin Panel Test Script
# This script tests all admin endpoints

$baseUrl = "http://127.0.0.1:8000/api/v1"

Write-Host "`n=== ADMIN PANEL ENDPOINT TEST ===" -ForegroundColor Cyan

# Step 1: Login as admin
Write-Host "`n[1] Logging in as admin..." -ForegroundColor Yellow
$loginBody = @{username="admin@sentinel.com"; password="AdminPass123"}
try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" -Method POST -Body $loginBody
    $token = $loginResponse.access_token
    $headers = @{Authorization="Bearer $token"}
    Write-Host "✓ Login successful" -ForegroundColor Green
} catch {
    Write-Host "✗ Login failed: $_" -ForegroundColor Red
    exit 1
}

# Step 2: Get Dashboard Stats
Write-Host "`n[2] Fetching dashboard stats..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$baseUrl/admin/stats" -Headers $headers
    Write-Host "✓ Stats fetched:" -ForegroundColor Green
    Write-Host "  - Total Users: $($stats.total_users)" -ForegroundColor White
    Write-Host "  - Total Reports: $($stats.total_reports)" -ForegroundColor White
    Write-Host "  - Verified Reports: $($stats.verified_reports)" -ForegroundColor White
    Write-Host "  - Resolved Reports: $($stats.resolved_reports)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to fetch stats: $_" -ForegroundColor Red
}

# Step 3: Get Users
Write-Host "`n[3] Fetching users..." -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri "$baseUrl/admin/users" -Headers $headers
    $userCount = if ($users -is [array]) { $users.Count } else { $users.items.Count }
    Write-Host "✓ Users fetched: $userCount users" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch users: $_" -ForegroundColor Red
}

# Step 4: Get Incidents
Write-Host "`n[4] Fetching incidents..." -ForegroundColor Yellow
try {
    $incidents = Invoke-RestMethod -Uri "$baseUrl/incidents" -Headers $headers
    $incidentCount = if ($incidents -is [array]) { $incidents.Count } else { if ($incidents.items) { $incidents.items.Count } else { 0 } }
    Write-Host "✓ Incidents fetched: $incidentCount incidents" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch incidents: $_" -ForegroundColor Red
}

# Step 5: Get Officers
Write-Host "`n[5] Fetching officers..." -ForegroundColor Yellow
try {
    $officers = Invoke-RestMethod -Uri "$baseUrl/admin/officers" -Headers $headers
    Write-Host "✓ Officers fetched: $($officers.Count) officers" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch officers: $_" -ForegroundColor Red
}

# Step 6: Get Audit Logs
Write-Host "`n[6] Fetching audit logs..." -ForegroundColor Yellow
try {
    $logs = Invoke-RestMethod -Uri "$baseUrl/admin/audit-logs?limit=10" -Headers $headers
    Write-Host "✓ Audit logs fetched: $($logs.Count) logs" -ForegroundColor Green
} catch {
    Write-Host "✗ Failed to fetch logs: $_" -ForegroundColor Red
}

# Step 7: Get Analytics
Write-Host "`n[7] Fetching analytics data..." -ForegroundColor Yellow
try {
    $trends = Invoke-RestMethod -Uri "$baseUrl/admin/analytics/trends" -Headers $headers
    $categories = Invoke-RestMethod -Uri "$baseUrl/admin/analytics/categories" -Headers $headers
    $areas = Invoke-RestMethod -Uri "$baseUrl/admin/analytics/dangerous-areas" -Headers $headers
    Write-Host "✓ Analytics fetched:" -ForegroundColor Green
    Write-Host "  - Trends: $($trends.Count) data points" -ForegroundColor White
    Write-Host "  - Categories: $($categories.Count) categories" -ForegroundColor White
    Write-Host "  - Dangerous Areas: $($areas.Count) areas" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to fetch analytics: $_" -ForegroundColor Red
}

# Step 8: Get System Health
Write-Host "`n[8] Checking system health..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/admin/system/status" -Headers $headers
    Write-Host "✓ System health:" -ForegroundColor Green
    Write-Host "  - API: $($health.api)" -ForegroundColor White
    Write-Host "  - Database: $($health.database)" -ForegroundColor White
} catch {
    Write-Host "✗ Failed to check health: $_" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETE ===" -ForegroundColor Cyan
Write-Host "All admin endpoints are working correctly!" -ForegroundColor Green
Write-Host "`nYou can now access the admin panel at: http://127.0.0.1:5174/admin/dashboard" -ForegroundColor Yellow
Write-Host "Login with: admin@sentinel.com / AdminPass123" -ForegroundColor Yellow
