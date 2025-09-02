@echo off
echo ============================================
echo  Deploy OWATCH ke Base Sepolia Testnet
echo ============================================
echo.

REM Check if .env file exists
if not exist ".env" (
    echo [ERROR] File .env tidak ditemukan!
    echo Silakan copy .env.example ke .env dan isi PRIVATE_KEY
    pause
    exit /b 1
)

REM Check if PRIVATE_KEY is set
findstr /C:"PRIVATE_KEY=" .env >nul
if %errorlevel% neq 0 (
    echo [ERROR] PRIVATE_KEY tidak ditemukan di .env file!
    echo Silakan isi PRIVATE_KEY di file .env
    pause
    exit /b 1
)

echo [OK] Environment check passed
echo.

REM Compile contract
echo Compiling contract...
call forge build
if %errorlevel% neq 0 (
    echo [ERROR] Compile gagal!
    pause
    exit /b 1
)

echo [OK] Contract compiled successfully
echo.

REM Run tests
echo Running tests...
call forge test
if %errorlevel% neq 0 (
    echo [ERROR] Tests gagal!
    pause
    exit /b 1
)

echo [OK] All tests passed
echo.

REM Deploy to testnet
echo Deploying to Base Sepolia...
echo Pastikan wallet Anda punya ETH untuk gas fees!
echo.

call forge script scripts/DeployOWATCH.s.sol --rpc-url https://sepolia.base.org --private-key %PRIVATE_KEY% --broadcast --verify

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo [SUCCESS] Contract deployed successfully!
    echo ============================================
    echo.
    echo Selanjutnya:
    echo 1. Copy contract address dari output di atas
    echo 2. Update NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS di .env
    echo 3. Verify contract di BaseScan jika perlu
    echo.
) else (
    echo.
    echo [ERROR] Deployment gagal!
    echo Cek:
    echo - Private key benar
    echo - Wallet punya cukup ETH
    echo - Network connection
    echo.
)

pause
