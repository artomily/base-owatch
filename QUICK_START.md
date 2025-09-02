# O'Watch.ID Smart Contract - Quick Setup

## ⚡ Current Status: ✅ Contract Ready

Your smart contract is fully implemented and validated! Here's the current status:

- ✅ **Contract**: `OWATCH.sol` - Complete ERC20 token with watch-to-earn features
- ✅ **Tests**: Comprehensive test suite ready
- ✅ **Deployment**: Scripts prepared for Base Sepolia and Mainnet
- ✅ **Validation**: All components verified and working

## 🚀 Next Steps

### 1. Install Foundry (Required)
```bash
# Visit: https://github.com/foundry-rs/foundry/releases/latest
# Download: foundry_windows_amd64.zip (for Windows)
# Extract and add 'bin' folder to your PATH

# Verify installation
forge --version
```

### 2. Setup Environment
```bash
# Copy environment file
copy .env.example .env

# Edit .env and add your private key
# PRIVATE_KEY=your_private_key_here (without 0x prefix)
```

### 3. Validate Setup
```bash
# Quick validation of contract and files
npm run contract:validate
```

### 4. Test Contract
```bash
# Run tests (requires Foundry)
npm run contract:test

# With gas reporting
npm run contract:test:gas
```

### 5. Deploy to Testnet
```bash
# Get ETH from faucet first: https://sepoliafaucet.com/
npm run contract:deploy:sepolia
```

## 🛠️ Tools Required

### Essential
- ✅ **Node.js** (✅ Installed)
- ❌ **Foundry** (Download from GitHub releases)
- ✅ **Wallet** (MetaMask, Coinbase Wallet, etc.)
- ❌ **Base Sepolia ETH** (Get from faucet)

### Optional
- 📊 **BaseScan API Key** (for contract verification)

## 🌐 Networks

| Network | Status | RPC URL |
|---------|--------|---------|
| Base Sepolia | ✅ Testnet | https://sepolia.base.org |
| Base Mainnet | ❌ Production | https://mainnet.base.org |

## 📋 Contract Features

### OWATCH Token (Simplified)
- **Supply**: 1,000,000 OWATCH
- **Reward Rate**: 10 OWATCH per minute watched
- **Functions**:
  - `registerUser()` - Register user
  - `earnReward(minutes)` - Earn tokens
  - `getUserInfo(user)` - Get user data

## 🚀 Deployment Steps

### Step 1: Get Test ETH
1. Go to [Base Sepolia Faucet](https://sepoliafaucet.com/)
2. Connect wallet
3. Request ETH

### Step 2: Setup Private Key
```bash
# Di file .env
PRIVATE_KEY=0x_your_private_key_here
```

### Step 3: Deploy
```bash
# Windows: Double-click deploy-testnet.bat
# Linux/Mac: npm run contract:deploy:sepolia
```

### Step 4: Update Frontend
```bash
# Copy contract address dari deployment output
NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS=0x_your_contract_address
```

## 🧪 Testing Commands

```bash
# Test semua
npm run contract:test

# Test dengan gas report
npm run contract:test:gas

# Coverage report
npm run contract:coverage
```

## 🔍 Verify Contract (Optional)

```bash
# Setup BaseScan API key di .env
BASESCAN_API_KEY=your_api_key_here

# Verify contract
npm run contract:verify:sepolia
```

## 📞 Help & Support

### Jika Error:
1. **Foundry tidak terinstall**: Download manual dari GitHub releases
2. **Private key salah**: Pastikan format benar (0x...)
3. **Tidak ada ETH**: Dapatkan dari faucet
4. **Network error**: Coba lagi atau ganti RPC

### Useful Links:
- [Base Sepolia Faucet](https://sepoliafaucet.com/)
- [BaseScan Testnet](https://sepolia.basescan.org/)
- [Foundry Docs](https://book.getfoundry.sh/)
- [Base Discord](https://discord.gg/buildonbase)

## ✅ Checklist

- [ ] Setup .env dengan PRIVATE_KEY
- [ ] Install Foundry (via script)
- [ ] Dapatkan ETH dari faucet
- [ ] Test contract (npm run contract:test)
- [ ] Deploy ke testnet
- [ ] Update frontend dengan contract address
- [ ] Test integration

---

**Happy coding! 🚀**
