@echo off
echo ============================================
echo  Foundry Installation Helper for Windows
echo ============================================
echo.

echo This script will help you install Foundry on Windows.
echo.
echo Steps:
echo 1. Download Foundry from GitHub
echo 2. Extract the ZIP file
echo 3. Add to PATH
echo.

echo Press any key to open the download page...
pause >nul

start https://github.com/foundry-rs/foundry/releases/latest

echo.
echo After downloading:
echo 1. Extract foundry_windows_amd64.zip
echo 2. Copy the 'bin' folder to a permanent location (e.g., C:\foundry)
echo 3. Add the bin folder to your PATH:
echo    - Search for "Environment Variables"
echo    - Edit "Path" in System Variables
echo    - Add: C:\foundry\bin (or your chosen path)
echo.

echo 4. Restart your terminal/command prompt
echo 5. Verify installation: forge --version
echo.

echo For detailed instructions, visit:
echo https://book.getfoundry.sh/getting-started/installation
echo.

pause
