@echo off
setlocal
cd /d "%~dp0"

echo ==========================================
echo Publish to GitHub and Vercel
echo ==========================================
echo.

echo Step 1: Create an empty GitHub repository.
echo Recommended repository name: ai-contract-review-demo
echo Do NOT add README, .gitignore, or license on GitHub.
echo.
start "" "https://github.com/new"
echo After creating the repository, copy its HTTPS URL.
echo Example: https://github.com/username/ai-contract-review-demo.git
echo.
set /p REPO_URL=Paste the GitHub repository HTTPS URL here: 

if "%REPO_URL%"=="" (
  echo ERROR: Repository URL is required.
  pause
  exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 (
  git remote add origin "%REPO_URL%"
) else (
  git remote set-url origin "%REPO_URL%"
)

echo.
echo Step 2: Push code to GitHub.
echo GitHub may open a browser window for login authorization.
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
echo Step 3: Deploy to Vercel.
echo Vercel may open a browser window for login authorization.
call deploy-vercel.bat

echo.
echo Publishing flow finished.
pause
