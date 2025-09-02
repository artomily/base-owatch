# O'Watch.ID Smart Contract (Simplified)

Smart contract sederhana untuk platform watch-to-earn O'Watch.ID menggunakan Base network.

## �️ Tools yang Dibutuhkan

### 1. **Foundry** (Development Framework)
```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Verify installation
forge --version
```

### 2. **Node.js & NPM** (sudah terinstall)
```bash
node --version
npm --version
```

### 3. **Wallet dengan Base Sepolia ETH**
- [MetaMask](https://metamask.io/) atau wallet lainnya
- Dapatkan ETH testnet dari [Base Sepolia Faucet](https://sepoliafaucet.com/)

## � Quick Start

### 1. Setup Project
```bash
# Clone atau setup project
cd base-owatch

# Install dependencies
npm install
```

### 2. Setup Environment
```bash
# Copy environment file
cp .env.example .env

# Edit .env dengan private key Anda
# PRIVATE_KEY=your_private_key_here
```

### 3. Compile Contract
```bash
# Menggunakan Foundry
forge build

# Atau menggunakan NPM script
npm run contract:build
```

### 4. Run Tests
```bash
# Run semua test
forge test

# Atau menggunakan NPM script
npm run contract:test
```

### 5. Deploy ke Base Sepolia Testnet
```bash
# Pastikan punya ETH di wallet untuk gas fees
forge script scripts/DeployOWATCH.s.sol --rpc-url https://sepolia.base.org --private-key $PRIVATE_KEY --broadcast --verify

# Atau menggunakan NPM script
npm run contract:deploy:sepolia
```

## � Contract Features (Simplified)

### OWATCH Token Contract
- ✅ **ERC20 Token** dengan 1 juta supply awal
- ✅ **User Registration** - Sistem registrasi sederhana
- ✅ **Earn Rewards** - Dapat reward berdasarkan menit menonton (10 OWATCH per menit)
- ✅ **Emergency Functions** - Fungsi darurat untuk owner

### Key Functions
```solidity
// Register sebagai user
registerUser()

// Earn reward (dalam menit)
earnReward(uint256 minutesWatched)

// Get user info
getUserInfo(address user) returns (bool registered, uint256 balance)

// Emergency withdraw (owner only)
emergencyWithdraw(uint256 amount)
```

## 🧪 Testing

### Local Testing
```bash
# Run semua test
forge test

# Run test spesifik
forge test --match-test testUserRegistration

# Dengan gas report
forge test --gas-report
```

### Test Coverage
```bash
forge coverage
```

## 🌐 Deployment

### Base Sepolia Testnet
```bash
# Deploy
forge script scripts/DeployOWATCH.s.sol \
  --rpc-url https://sepolia.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify

# Verify contract
forge verify-contract <CONTRACT_ADDRESS> OWATCH \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

### Base Mainnet (Production)
```bash
# Deploy ke mainnet (hati-hati!)
forge script scripts/DeployOWATCH.s.sol \
  --rpc-url https://mainnet.base.org \
  --private-key $PRIVATE_KEY \
  --broadcast \
  --verify
```

## 🔧 Environment Setup

### .env File
```bash
# Wallet Private Key (untuk deploy)
PRIVATE_KEY=your_private_key_here

# BaseScan API Key (untuk verify contract)
BASESCAN_API_KEY=your_basescan_api_key

# Contract Address (setelah deploy)
NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS=0x...
```

## 📊 Networks

| Network | RPC URL | Block Explorer | Chain ID |
|---------|---------|----------------|----------|
| Base Sepolia | https://sepolia.base.org | https://sepolia.basescan.org | 84532 |
| Base Mainnet | https://mainnet.base.org | https://basescan.org | 8453 |

## 💰 Getting Test ETH

1. **Base Sepolia Faucet**: https://sepoliafaucet.com/
2. **Paradigm Faucet**: https://faucet.paradigm.xyz/
3. **Alchemy Faucet**: https://sepoliafaucet.com/

## � Verify Contract

Setelah deploy, verify contract di BaseScan:

```bash
forge verify-contract <YOUR_CONTRACT_ADDRESS> OWATCH \
  --chain-id 84532 \
  --etherscan-api-key $BASESCAN_API_KEY
```

## � Frontend Integration

Setelah deploy, update `.env` di frontend:

```bash
NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS=0x... # Address dari deployment
```

## 🆘 Troubleshooting

### Foundry tidak terinstall
```bash
# Windows
# Download dari: https://github.com/foundry-rs/foundry/releases
# Extract dan tambahkan ke PATH

# Linux/Mac
curl -L https://foundry.paradigm.xyz | bash
```

### Gas estimation failed
- Pastikan wallet punya cukup ETH untuk gas
- Coba deploy di jam sepi

### Contract verification failed
- Pastikan BASESCAN_API_KEY benar
- Tunggu beberapa menit setelah deploy
- Cek contract address di BaseScan

## 📞 Support

Untuk bantuan:
- Cek [Foundry Documentation](https://book.getfoundry.sh/)
- Join [Base Discord](https://discord.gg/buildonbase)
- Cek [BaseScan](https://sepolia.basescan.org/)
