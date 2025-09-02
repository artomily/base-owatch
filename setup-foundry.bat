@echo off
echo ============================================
echo  O'Watch.ID Smart Contract Setup (Simple)
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js tidak terinstall!
    echo Silakan download dari: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [OK] Node.js terinstall
)

REM Check if Foundry is installed
forge --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Foundry tidak terinstall
    echo.
    echo Menginstall Foundry...
    echo Jika gagal, download manual dari:
    echo https://github.com/foundry-rs/foundry/releases
    echo.

    REM Try to install Foundry
    powershell -Command "& { try { irm https://foundry.paradigm.xyz | iex } catch { echo 'Gagal install Foundry otomatis' } }"
) else (
    echo [OK] Foundry terinstall
)

echo.
echo Menginstall dependencies...
call npm install

echo.
echo Setup selesai!
echo.
echo Selanjutnya:
echo 1. Setup .env file dengan private key
echo 2. Dapatkan ETH testnet dari faucet
echo 3. Jalankan: npm run contract:test
echo 4. Deploy: npm run contract:deploy:sepolia
echo.
pause
