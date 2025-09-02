#!/bin/bash

echo "Setting up Foundry for O'Watch.ID Smart Contract Development"
echo "==========================================================="

# Check if Foundry is installed
if ! command -v forge &> /dev/null; then
    echo "Foundry not found. Installing Foundry..."
    curl -L https://foundry.paradigm.xyz | bash
    source ~/.bashrc
    foundryup
else
    echo "Foundry is already installed."
fi

# Install dependencies
echo "Installing OpenZeppelin contracts..."
forge install OpenZeppelin/openzeppelin-contracts

# Install forge-std if not exists
if [ ! -d "lib/forge-std" ]; then
    echo "Installing forge-std..."
    forge install foundry-rs/forge-std
fi

echo ""
echo "Setup complete! You can now:"
echo "- Compile contracts: forge build"
echo "- Run tests: forge test"
echo "- Deploy to Base Sepolia: forge script scripts/DeployOWATCH.s.sol --rpc-url https://sepolia.base.org --private-key YOUR_PRIVATE_KEY --broadcast --verify"
echo "- Deploy to Base Mainnet: forge script scripts/DeployOWATCH.s.sol --rpc-url https://mainnet.base.org --private-key YOUR_PRIVATE_KEY --broadcast --verify"
echo ""
echo "Make sure to:"
echo "1. Set up your .env file with PRIVATE_KEY"
echo "2. Get BaseScan API key for contract verification"
echo "3. Fund your wallet with Base ETH for deployment"
echo ""
echo "Contract Address will be displayed after successful deployment."
