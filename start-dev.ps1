$root = $PSScriptRoot
$python = "C:\Program Files\PostgreSQL\18\pgAdmin 4\python\python.exe"

if (-not (Test-Path $python)) {
  throw "Python runtime not found at $python"
}

Start-Process -FilePath $python -ArgumentList "-m","uvicorn","app.main:app","--app-dir","backend","--host","127.0.0.1","--port","8001","--reload" -WorkingDirectory $root
Start-Process -FilePath "npm.cmd" -ArgumentList "run","dev" -WorkingDirectory "$root\frontend"

Write-Host "Backend:  http://127.0.0.1:8001"
Write-Host "Frontend: http://127.0.0.1:5174"
