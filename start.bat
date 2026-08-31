@echo off
title VANGUARD - Rural Service Routing Platform
color 0A

echo ======================================================================
echo          VANGUARD - Rural Service Routing Platform (MVP)
echo ======================================================================
echo.

cd /d "%~dp0"

:: 1. Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not found in your system PATH.
    echo Please install Node.js v18 or v20 plus from https://nodejs.org
    echo.
    pause
    exit /b 1
)

echo [1/4] Node.js environment detected.

:: 2. Check and free Port 3000 if occupied by orphaned process
echo [2/4] Verifying network ports...
powershell -NoProfile -Command "$conn = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue; if ($conn) { foreach ($c in $conn) { Stop-Process -Id $c.OwningProcess -Force -ErrorAction SilentlyContinue } }"

:: 3. Check if node_modules exists, install if missing
if not exist "node_modules\" (
    echo [3/4] Installing dependencies, please wait...
    call npm.cmd install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install npm dependencies.
        pause
        exit /b 1
    )
) else (
    echo [3/4] Dependencies verified.
)

:: 4. Check database and seed if needed
if not exist "dev.db" (
    echo [4/4] Initializing SQLite database and seeding demo accounts...
    call npx.cmd prisma db push
    call npx.cmd tsx prisma/seed.ts
) else (
    echo [4/4] Database verified.
)

:: 5. Launch browser after 2 seconds
start "" powershell -NoProfile -Command "Start-Sleep -Seconds 2; Start-Process 'http://localhost:3000'"

echo.
echo ======================================================================
echo  VANGUARD is starting on http://localhost:3000
echo  Your browser will open automatically in 2 seconds.
echo  Press Ctrl+C in this window at any time to stop the server.
echo ======================================================================
echo.

:: 6. Start Next.js development server
call npm.cmd run dev

if %errorlevel% neq 0 (
    color 0C
    echo.
    echo [ERROR] Server exited with an error code.
    pause
)
