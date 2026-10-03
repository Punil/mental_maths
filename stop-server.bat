@echo off
title Stop Mental Maths Server
echo ========================================================
echo   Stopping Mental Maths Server on port 3000 ...
echo ========================================================

set found=0
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
    echo Stopping process PID: %%a ...
    taskkill /f /pid %%a >nul 2>&1
    set found=1
)

if "%found%"=="1" (
    echo.
    echo [SUCCESS] Mental Maths server has been stopped.
) else (
    echo.
    echo [INFO] No server was found running on port 3000.
)

echo ========================================================
pause
