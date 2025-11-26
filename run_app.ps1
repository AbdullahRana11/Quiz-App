Write-Host "Starting Quiz App..." -ForegroundColor Green

# Backend
Write-Host "Starting Backend Server..." -ForegroundColor Cyan
# Opens a new PowerShell window, installs dependencies, and starts the backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; pip install fastapi uvicorn mysql-connector-python pydantic; uvicorn main:app --reload"

# Frontend
Write-Host "Starting Frontend Server..." -ForegroundColor Cyan
# Opens a new PowerShell window, installs dependencies, and starts the frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm install; npm run dev"

Write-Host "Both servers are starting in separate windows." -ForegroundColor Green
Write-Host "Please wait for them to initialize..."
