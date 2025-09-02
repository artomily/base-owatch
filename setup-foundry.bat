@echo off
echo Setting up Foundry for O'Watch.ID Smart Contract Development
echo ========================================================

REM Check if Foundry is installed
forge --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Foundry not found. Installing Foundry...
    REM Try to install Foundry using the official installer
    powershell -Command "& { try { irm https://foundry.paradigm.xyz | iex } catch { echo 'Failed to install Foundry automatically. Please install manually from https://book.getfoundry.sh/getting-started/installation.html' } }"
) else (
    echo Foundry is already installed.
)

REM Install dependencies
echo Installing OpenZeppelin contracts...
forge install OpenZeppelin/openzeppelin-contracts

REM Create lib directory if it doesn't exist
if not exist "lib" mkdir lib

REM Copy OpenZeppelin contracts to lib
if exist "lib\forge-std" (
    echo Forge std already exists
) else (
    echo Installing forge-std...
    forge install foundry-rs/forge-std
)

echo.
echo Setup complete! You can now:
echo - Compile contracts: forge build
echo - Run tests: forge test
echo - Deploy to Base: forge script scripts/DeployOWATCH.s.sol --rpc-url https://mainnet.base.org --private-key YOUR_PRIVATE_KEY --broadcast
echo.
echo Make sure to:
echo 1. Set up your .env file with PRIVATE_KEY
echo 2. Get BaseScan API key for contract verification
echo 3. Fund your wallet with Base ETH for deployment
echo.
pause
