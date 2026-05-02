$python = "C:\Program Files\PostgreSQL\18\pgAdmin 4\python\python.exe"
if (-not (Test-Path $python)) {
  throw "Python runtime not found at $python"
}

Set-Location "$PSScriptRoot"
& $python -m uvicorn app.main:app --app-dir backend --host 127.0.0.1 --port 8001 --reload
