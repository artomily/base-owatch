const fs = require('fs');
const path = require('path');

console.log('🚀 O\'Watch.ID Smart Contract Validation');
console.log('=====================================\n');

// Check if contract file exists
const contractPath = path.join(__dirname, 'contracts', 'OWATCH.sol');
if (!fs.existsSync(contractPath)) {
  console.error('❌ Contract file not found:', contractPath);
  process.exit(1);
}

console.log('✅ Contract file found');

// Read contract content
const contractContent = fs.readFileSync(contractPath, 'utf8');

// Basic validation checks
const checks = [
  {
    name: 'Contract declaration',
    pattern: /contract OWATCH/,
    required: true
  },
  {
    name: 'ERC20 inheritance',
    pattern: /ERC20\(/,
    required: true
  },
  {
    name: 'Ownable inheritance',
    pattern: /Ownable/,
    required: true
  },
  {
    name: 'registerUser function',
    pattern: /function registerUser/,
    required: true
  },
  {
    name: 'earnReward function',
    pattern: /function earnReward/,
    required: true
  },
  {
    name: 'getUserInfo function',
    pattern: /function getUserInfo/,
    required: true
  },
  {
    name: 'REWARD_PER_MINUTE constant',
    pattern: /REWARD_PER_MINUTE/,
    required: true
  },
  {
    name: 'MIN_WATCH_TIME constant',
    pattern: /MIN_WATCH_TIME/,
    required: true
  }
];

let passedChecks = 0;
let failedChecks = 0;

checks.forEach(check => {
  if (check.pattern.test(contractContent)) {
    console.log(`✅ ${check.name}`);
    passedChecks++;
  } else {
    console.log(`❌ ${check.name} - MISSING`);
    if (check.required) failedChecks++;
  }
});

console.log(`\n📊 Validation Results:`);
console.log(`   Passed: ${passedChecks}`);
console.log(`   Failed: ${failedChecks}`);
console.log(`   Total:  ${checks.length}`);

if (failedChecks === 0) {
  console.log('\n🎉 Contract structure validation PASSED!');
  console.log('\nNext steps:');
  console.log('1. Install Foundry: https://book.getfoundry.sh/getting-started/installation');
  console.log('2. Run: forge test');
  console.log('3. Deploy: forge script scripts/DeployOWATCH.s.sol --rpc-url <RPC_URL> --private-key <PRIVATE_KEY> --broadcast');
} else {
  console.log('\n⚠️  Contract structure validation FAILED!');
  console.log('Please check the contract file for missing components.');
  process.exit(1);
}

// Check test file
const testPath = path.join(__dirname, 'test', 'OWATCH.t.sol');
if (fs.existsSync(testPath)) {
  console.log('\n✅ Test file found');
  const testContent = fs.readFileSync(testPath, 'utf8');

  const testChecks = [
    'testInitialSupply',
    'testUserRegistration',
    'testEarnReward'
  ];

  testChecks.forEach(testName => {
    if (testContent.includes(testName)) {
      console.log(`✅ Test: ${testName}`);
    } else {
      console.log(`❌ Test: ${testName} - MISSING`);
    }
  });
} else {
  console.log('\n⚠️  Test file not found');
}

// Check deployment script
const deployPath = path.join(__dirname, 'scripts', 'DeployOWATCH.s.sol');
if (fs.existsSync(deployPath)) {
  console.log('✅ Deployment script found');
} else {
  console.log('⚠️  Deployment script not found');
}

console.log('\n🏁 Validation complete!');
