# O'Watch.ID Smart Contract - Quick Setup

## ⚡ Quick Start (5 menit)

### 1. Setup Environment
```bash
# Copy environment file
copy .env.example .env

# Edit .env dan isi PRIVATE_KEY Anda
# PRIVATE_KEY=your_private_key_here
```

### 2. Install & Setup
```bash
# Windows: Double-click setup-foundry.bat
# Linux/Mac: chmod +x setup-foundry.sh && ./setup-foundry.sh

# Install dependencies
npm install
```

### 3. Test Contract
```bash
# Compile
npm run contract:build

# Test
npm run contract:test
```

### 4. Deploy ke Testnet
```bash
# Pastikan punya ETH di wallet (dapatkan dari faucet)
npm run contract:deploy:sepolia
```

## 🛠️ Tools Required

### Essential
- ✅ **Node.js** (sudah ada)
- ✅ **Foundry** (install otomatis)
- ✅ **Wallet** (MetaMask, dll)
- ✅ **Base Sepolia ETH** (dari faucet)

### Optional
- 📊 **BaseScan API Key** (untuk verify contract)

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
