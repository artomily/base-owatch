# O'Watch.ID Smart Contract - Deployment Guide

## 📋 Prerequisites

### 1. Install Foundry
Foundry is required to compile, test, and deploy the smart contracts.

**For Windows:**
```bash
# Download from GitHub releases
# Visit: https://github.com/foundry-rs/foundry/releases/latest
# Download: foundry_windows_amd64.zip
# Extract and add to PATH
```

**For macOS/Linux:**
```bash
curl -L https://foundry.paradigm.xyz | bash
foundryup
```

### 2. Verify Installation
```bash
forge --version
# Should show: forge 0.x.x
```

### 3. Install Dependencies
```bash
npm install
```

## 🧪 Testing

### Run All Tests
```bash
npm run contract:test
# or
forge test
```

### Run Tests with Gas Report
```bash
npm run contract:test:gas
# or
forge test --gas-report
```

### Run Coverage
```bash
npm run contract:coverage
# or
forge coverage
```

## 🚀 Deployment

### 1. Setup Environment Variables

Create a `.env` file in the root directory:
```bash
# Your private key (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# BaseScan API Key (for contract verification)
BASESCAN_API_KEY=your_basescan_api_key_here
```

### 2. Get Testnet ETH
- **Base Sepolia Faucet**: https://sepoliafaucet.com/
- **Coinbase Faucet**: https://faucet.coinbase.com/

### 3. Deploy to Base Sepolia Testnet
```bash
npm run contract:deploy:sepolia
# or
forge script scripts/DeployOWATCH.s.sol --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY --broadcast --verify
```

### 4. Deploy to Base Mainnet
```bash
npm run contract:deploy:mainnet
# or
forge script scripts/DeployOWATCH.s.sol --rpc-url https://mainnet.base.org --private-key $PRIVATE_KEY --broadcast --verify
```

## 📊 Contract Details

- **Contract**: `OWATCH.sol`
- **Token Name**: O'Watch Token
- **Token Symbol**: OWATCH
- **Initial Supply**: 1,000,000 OWATCH
- **Reward Rate**: 10 OWATCH per minute watched
- **Minimum Watch Time**: 1 minute

## 🔧 Contract Functions

### User Registration
```solidity
function registerUser() external
```
- Registers a user to participate in the watch-to-earn program

### Earn Rewards
```solidity
function earnReward(uint256 minutesWatched) external
```
- Records watch time and mints OWATCH tokens as rewards
- Requires user to be registered
- Minimum 1 minute watch time

### Check User Info
```solidity
function getUserInfo(address user) external view returns (bool, uint256)
```
- Returns registration status and token balance for a user

### Emergency Functions (Owner Only)
```solidity
function emergencyWithdraw(uint256 amount) external onlyOwner
```
- Allows contract owner to withdraw tokens in emergency situations

## 📝 Verification

After deployment, verify your contract on BaseScan:

### Manual Verification
```bash
forge verify-contract --chain-id 84532 --etherscan-api-key $BASESCAN_API_KEY <CONTRACT_ADDRESS> contracts/OWATCH.sol:OWATCH
```

### Automatic Verification (during deployment)
The deployment scripts include the `--verify` flag for automatic verification.

## 🌐 Network Information

### Base Sepolia Testnet
- **Chain ID**: 84532
- **RPC URL**: https://sepolia.base.org
- **Block Explorer**: https://sepolia.basescan.org
- **Faucet**: https://sepoliafaucet.com

### Base Mainnet
- **Chain ID**: 8453
- **RPC URL**: https://mainnet.base.org
- **Block Explorer**: https://basescan.org

## 🔗 Frontend Integration

After deployment, update your frontend with the deployed contract address:

```javascript
// Add to your .env.local
NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS=0x...
```

## 📞 Support

If you encounter issues:

1. **Foundry Installation**: Follow the official guide at https://book.getfoundry.sh/getting-started/installation
2. **Deployment Issues**: Ensure you have sufficient ETH for gas fees
3. **Verification Issues**: Check your BaseScan API key is correct

## ✅ Quick Validation

Run this to validate your setup:
```bash
npm run contract:validate
```

This will check that all contract components are properly configured.</content>
<parameter name="filePath">D:\Code\base-owatch\DEPLOYMENT_GUIDE.md
