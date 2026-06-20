@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo Continue GitHub and Vercel publishing
echo ==========================================
echo.
echo Pushing code to GitHub...
echo GitHub may ask you to sign in through your browser.
echo.

git config --global --add safe.directory "%CD%"
if errorlevel 1 (
  echo ERROR: Failed to mark the project folder as a safe Git directory.
  pause
  exit /b 1
)

git push -u origin main
if errorlevel 1 (
  echo.
  echo ERROR: GitHub push failed. Review the message above.
  pause
  exit /b 1
)

echo.
echo GitHub push succeeded. Starting Vercel deployment...
call deploy-vercel.bat

echo.
echo Publishing flow finished.
pause
