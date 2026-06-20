@echo off
cd /d "%~dp0"

where node.exe >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js was not found. Please install Node.js first.
  pause
  exit /b 1
)

where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo ERROR: npm was not found. Please install Node.js first.
  pause
  exit /b 1
)

node scripts\deploy-vercel.cjs

echo.
echo Deployment command finished. Press any key to close this window.
pause
