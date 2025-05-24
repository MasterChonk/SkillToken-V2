# SkillToken - Web3 Skill Certification Platform

A decentralized platform for issuing and verifying skill certificates as NFTs, with permanent storage on Filecoin.

## 🌟 Features

- **NFT Certificates**: Issue skill certificates as ERC-721 NFTs
- **Role-based Access**: Teachers, Issuers, and Students with specific permissions  
- **Filecoin Storage**: Permanent certificate storage via Web3.Storage
- **Certificate Validation**: On-chain validation and verification
- **Public Verification**: Anyone can verify certificates via tokenId
- **Delegated Issuing**: Teachers can delegate certificate issuing rights

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│    Frontend     │    │  Smart Contract │    │    Filecoin     │
│   (React/JS)    │◄──►│   (Solidity)    │◄──►│  (Web3Storage)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
    User Interface         NFT Logic &            Certificate PDFs
    Certificate View       Role Management        & Metadata JSON
```

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Git](https://git-scm.com/)
- [MetaMask](https://metamask.io/) browser extension

### Option 1: Automated Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd skilltoken

# Run automated setup
chmod +x setup.sh
./setup.sh
```

### Option 2: Manual Setup

```bash
# Clone and install
git clone <your-repo-url>
cd skilltoken
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Initialize contracts
cd contracts
forge install
forge build
cd ..
```

## 🛠️ Development Workflow

### 1. Start Local Blockchain
```bash
# Terminal 1: Start Anvil (local Ethereum network)
npm run anvil
```

### 2. Deploy Contracts
```bash
# Terminal 2: Deploy to local network
npm run deploy:local
```

### 3. Start Frontend
```bash
# Terminal 3: Start frontend development server
npm run frontend
```

### All-in-One Development
```bash
# Start everything at once
npm run dev
```

## 📱 MetaMask Configuration

### Add Local Network
- **Network Name**: Anvil Local
- **RPC URL**: http://127.0.0.1:8545
- **Chain ID**: 31337
- **Currency Symbol**: ETH

### Test Accounts (Pre-funded)

| Role | Address | Private Key |
|------|---------|-------------|
| Admin | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80` |
| Teacher 1 | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d` |
| Student | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a` |

> ⚠️ **Warning**: These are test keys for development only. Never use them with real funds!

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests with detailed output
npm run test:verbose

# Run tests with gas reporting
npm run test:gas

# Generate coverage report
npm run coverage
```

## 📂 Project Structure

```
skilltoken/
├── contracts/                 # Foundry project
│   ├── src/
│   │   ├── SkillToken.sol    # Main NFT contract
│   │   └── interfaces/       # Contract interfaces
│   ├── test/
│   │   └── SkillToken.t.sol  # Contract tests
│   ├── script/
│   │   └── Deploy.s.sol      # Deployment script
│   ├── foundry.toml          # Foundry configuration
│   └── lib/                  # Dependencies
├── frontend/                  # React/JS application
│   ├── src/
│   │   ├── utils/
│   │   │   └── contract.js   # Contract integration
│   │   ├── components/       # UI components
│   │   └── pages/           # Application pages
│   ├── index.html
│   └── package.json
├── .env.example              # Environment template
├── package.json              # Root scripts
├── setup.sh                  # Automated setup
└── README.md
```

## 💻 Available Scripts

```bash
# Development
npm run anvil          # Start local blockchain
npm run deploy:local   # Deploy to local network
npm run frontend       # Start frontend dev server
npm run dev           # Start everything (anvil + deploy + frontend)

# Testing & Building
npm run test          # Run contract tests
npm run test:verbose  # Detailed test output
npm run test:gas      # Gas usage reporting
npm run build         # Build contracts
npm run clean         # Clean build artifacts

# Deployment
npm run deploy:testnet # Deploy to testnet
npm run reset         # Clean, build, and redeploy
```

## 🔧 Smart Contract API

### Core Functions

#### Teacher Functions
```solidity
// Register a new course
function registerCourse(string memory name) external returns (uint256)

// Get courses created by teacher
function getTeacherCourses(address teacher) external view returns (uint256[] memory)

// Validate a certificate
function validate(uint256 tokenId) external

// Delegate issuer role
function delegateIssuer(address issuer) external
```

#### Issuer Functions
```solidity
// Issue certificate to student
function issueCertificate(
    address student,
    uint256 courseId,
    string memory filecoinHash,
    string memory tokenURI
) external returns (uint256)
```

#### Student/Public Functions
```solidity
// Get student's certificates
function getStudentCertificates(address student) external view returns (uint256[] memory)

// Check if student completed course
function hasCompletedCourse(address student, uint256 courseId) external view returns (bool)

// Get certificate details
function getCertificate(uint256 tokenId) external view returns (Certificate memory)

// Get course details
function getCourse(uint256 courseId) external view returns (Course memory)
```

### Events

```solidity
event CourseRegistered(uint256 indexed courseId, string name, address indexed owner);

event CertificateIssued(
    uint256 indexed tokenId,
    address indexed student,
    uint256 indexed courseId,
    address issuer,
    string filecoinHash
);

event CertificateValidated(
    uint256 indexed tokenId,
    address indexed validator,
    address indexed student,
    uint256 courseId
);
```

## 🌐 Frontend Integration

### Contract Integration Example

```javascript
import { skillTokenContract } from './utils/contract.js';

// Initialize contract
await skillTokenContract.init();

// Connect wallet
const address = await skillTokenContract.connectWallet();

// Check user role
const role = await skillTokenContract.getUserRole(address);

// Register course (Teacher)
if (role.isTeacher) {
    const result = await skillTokenContract.registerCourse("Solidity Basics");
    console.log('Course ID:', result.courseId);
}

// Issue certificate (Issuer)
if (role.isIssuer) {
    const result = await skillTokenContract.issueCertificate(
        studentAddress,
        courseId,
        filecoinHash,
        tokenURI
    );
    console.log('Token ID:', result.tokenId);
}

// Get student certificates
const certificates = await skillTokenContract.getStudentCertificates(address);
```

### Event Listening

```javascript
// Listen for new certificates
skillTokenContract.onCertificateIssued((event) => {
    console.log('New certificate issued:', event);
    // Update UI
});

// Listen for course registrations
skillTokenContract.onCourseRegistered((event) => {
    console.log('New course registered:', event);
    // Update course list
});
```

## 🗂️ Environment Variables

```bash
# Local Development
ANVIL_RPC_URL=http://127.0.0.1:8545
ANVIL_PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# Contract Address (updated after deployment)
SKILLTOKEN_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3

# Web3.Storage (for Filecoin)
WEB3_STORAGE_TOKEN=your_web3_storage_token_here

# Frontend Configuration
VITE_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
VITE_CHAIN_ID=31337
VITE_RPC_URL=http://127.0.0.1:8545
```

## 🔄 User Workflows

### Teacher Workflow
1. Connect MetaMask wallet
2. Register new courses
3. Delegate issuing rights to trusted addresses
4. Validate issued certificates
5. View course statistics

### Issuer Workflow  
1. Connect MetaMask wallet
2. Issue certificates to students
3. Upload certificate files to Filecoin
4. Set certificate metadata
5. Mint NFT to student's wallet

### Student Workflow
1. Connect MetaMask wallet
2. Take courses/tests
3. Receive NFT certificates
4. View certificate collection
5. Share certificate links for verification

### Public Verification
1. Enter certificate token ID
2. View certificate details
3. Verify issuer and student
4. Download certificate PDF
5. Check validation status

## 🚨 Troubleshooting

### Common Issues

**"Failed to connect to anvil"**
- Ensure Anvil is running: `npm run anvil`
- Check RPC URL in MetaMask matches `http://127.0.0.1:8545`

**"Transaction reverted"**
- Check if wallet has sufficient ETH balance
- Verify user has correct role permissions
- Ensure course exists before issuing certificates

**"Contract not found"**
- Run deployment: `npm run deploy:local`
- Update contract address in `.env` file
- Restart frontend application

**"Wrong network"**
- Switch MetaMask to Anvil Local network
- Chain ID should be 31337
- Add network if not present

### Reset Development Environment

```bash
# Complete reset
npm run clean
npm run build
npm run deploy:local
# Update .env with new contract address
npm run frontend
```

## 🚀 Deployment to Testnet

### Sepolia Testnet Example

1. **Get testnet ETH**: Visit [Sepolia Faucet](https://sepoliafaucet.com/)

2. **Configure environment**:
```bash
TESTNET_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
TESTNET_PRIVATE_KEY=your-testnet-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

3. **Deploy**:
```bash
npm run deploy:testnet
```

4. **Verify contract** (optional):
```bash
cd contracts
forge verify-contract <contract-address> SkillToken --chain sepolia
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Development Guidelines

- Write tests for new features
- Follow Solidity style guide
- Update documentation
- Ensure all tests pass
- Use meaningful commit messages

## 📋 Roadmap

### MVP (Current)
- [x] NFT certificate issuance
- [x] Role-based access control
- [x] Filecoin integration
- [x] Basic frontend interface
- [x] Certificate validation

### Version 2.0
- [ ] zkProof certificate validation
- [ ] Soulbound NFT integration
- [ ] DAO-based course approvals
- [ ] Gamification (XP, badges, levels)
- [ ] Mobile application

### Future Features
- [ ] Cross-chain compatibility
- [ ] AI-powered skill assessment
- [ ] Employer verification portal
- [ ] Certificate marketplace
- [ ] Learning path recommendations

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenZeppelin](https://openzeppelin.com/) for smart contract libraries
- [Foundry](https://getfoundry.sh/) for development framework  
- [Web3.Storage](https://web3.storage/) for Filecoin integration
- [Ethereum](https://ethereum.org/) for the blockchain platform

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/skilltoken/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/skilltoken/discussions)
- **Email**: your-email@example.com

---

**Happy Learning and Building! 🎓✨**