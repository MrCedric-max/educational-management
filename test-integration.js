// Simple integration test script
const fetch = require('node-fetch');

async function testIntegration() {
  console.log('🧪 Testing Frontend-Backend Integration...\n');

  const tests = [
    {
      name: 'Health Check',
      url: 'http://localhost:3001/health',
      method: 'GET'
    },
    {
      name: 'API Test Endpoint',
      url: 'http://localhost:3001/api/test',
      method: 'GET'
    },
    {
      name: 'Users API',
      url: 'http://localhost:3001/api/users',
      method: 'GET'
    },
    {
      name: 'Login API',
      url: 'http://localhost:3001/api/auth/login',
      method: 'POST',
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123'
      })
    }
  ];

  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      
      const options = {
        method: test.method,
        headers: {
          'Content-Type': 'application/json',
        }
      };

      if (test.body) {
        options.body = test.body;
      }

      const response = await fetch(test.url, options);
      const data = await response.json();
      
      if (response.ok) {
        console.log(`✅ ${test.name}: PASS`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
      } else {
        console.log(`❌ ${test.name}: FAIL`);
        console.log(`   Status: ${response.status}`);
        console.log(`   Error: ${JSON.stringify(data)}`);
      }
    } catch (error) {
      console.log(`❌ ${test.name}: ERROR`);
      console.log(`   Error: ${error.message}`);
    }
    console.log('');
  }

  console.log('🎉 Integration test completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Navigate to /api-test page');
  console.log('3. Click "Run Integration Tests" button');
  console.log('4. Review the detailed test results');
}

testIntegration().catch(console.error);




