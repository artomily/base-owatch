# O'Watch.ID Smart Contract

Smart contract untuk platform watch-to-earn O'Watch.ID yang berjalan di Base network.

## 🚀 Features

- **User Registration**: Sistem registrasi user yang aman
- **Video Watching Rewards**: Sistem reward berdasarkan waktu menonton video
- **ERC20 Token**: Token OWATCH yang fully compliant dengan ERC20 standard
- **Admin Controls**: Kontrol penuh untuk owner/platform
- **Security**: Reentrancy protection dan access controls

## 📋 Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation.html)
- [Node.js](https://nodejs.org/) (untuk frontend integration)
- Wallet dengan Base network support

## 🛠️ Setup

### 1. Install Dependencies

```bash
# Install Foundry
curl -L https://foundry.paradigm.xyz | bash
foundryup

# Install dependencies
forge install OpenZeppelin/openzeppelin-contracts
```

### 2. Environment Setup

Buat file `.env` di root directory:

```bash
# Private key untuk deploy (gunakan test wallet untuk development)
PRIVATE_KEY=your_private_key_here

# Base network RPC URLs
BASE_MAINNET_RPC=https://mainnet.base.org
BASE_SEPOLIA_RPC=https://sepolia.base.org

# Block explorer API keys
BASESCAN_API_KEY=your_basescan_api_key
```

### 3. Compile Contract

```bash
forge build
```

### 4. Run Tests

```bash
forge test
```

### 5. Deploy ke Base Network

#### Deploy ke Base Sepolia (Testnet)

```bash
forge script scripts/DeployOWATCH.s.sol --rpc-url $BASE_SEPOLIA_RPC --private-key $PRIVATE_KEY --broadcast --verify
```

#### Deploy ke Base Mainnet

```bash
forge script scripts/DeployOWATCH.s.sol --rpc-url $BASE_MAINNET_RPC --private-key $PRIVATE_KEY --broadcast --verify
```

## 📚 Contract Overview

### OWATCH Token Contract

**Address**: [Will be updated after deployment]

**Features**:
- ERC20 compliant token
- User registration system
- Video watching reward system
- Admin controls for video management
- Emergency functions

### Key Functions

#### User Functions
- `registerUser()`: Register sebagai user platform
- `recordWatchTime(bytes32 videoId, uint256 watchedSeconds)`: Record waktu menonton video
- `claimRewards()`: Claim reward yang tersedia
- `getUserStats(address user)`: Get statistik user

#### Admin Functions
- `addVideo(bytes32 videoId, uint256 duration, uint256 rewardPerSecond)`: Tambah video baru
- `updateVideoReward(bytes32 videoId, uint256 newRewardPerSecond)`: Update reward video
- `setVideoActive(bytes32 videoId, bool active)`: Aktifkan/nonaktifkan video
- `emergencyWithdraw(uint256 amount)`: Emergency withdraw (owner only)

## 🔧 Integration dengan Frontend

### Environment Variables

Tambahkan ke `.env` file frontend:

```bash
NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS=0x... # Contract address setelah deploy
NEXT_PUBLIC_BASE_RPC_URL=https://mainnet.base.org
```

### Contract Interaction Example

```typescript
import { ethers } from 'ethers';
import OWATCH_ABI from './contracts/OWATCH.json';

// Connect to contract
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const owatchContract = new ethers.Contract(
  process.env.NEXT_PUBLIC_OWATCH_CONTRACT_ADDRESS,
  OWATCH_ABI,
  signer
);

// Register user
await owatchContract.registerUser();

// Record watch time
const videoId = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("video_123"));
await owatchContract.recordWatchTime(videoId, 300); // 5 minutes
```

## 🧪 Testing

### Local Testing

```bash
# Run all tests
forge test

# Run specific test
forge test --match-test testUserRegistration

# Run with gas reporting
forge test --gas-report
```

### Coverage Report

```bash
forge coverage
```

## 📊 Deployment Information

### Base Sepolia Testnet
- **Contract Address**: [TBD]
- **Block Explorer**: https://sepolia.basescan.org/
- **Faucet**: https://sepoliafaucet.com/

### Base Mainnet
- **Contract Address**: [TBD]
- **Block Explorer**: https://basescan.org/

## 🔒 Security

- ReentrancyGuard protection
- Access control dengan Ownable
- Input validation
- Emergency functions untuk owner

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, email support@owatch.id or join our Discord community.
