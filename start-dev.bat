@echo off
setlocal

cd /d "%~dp0"

if not exist node_modules (
  echo Installing dependencies...
  npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Please check the error above.
    pause
    exit /b 1
  )
)

echo.
echo Starting AI Contract Review Demo...
echo Open http://localhost:3000 after the server is ready.
echo Keep this window open while using the website.
echo.

npm run dev
pause
