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
