// A very simple integration test script for the auth endpoints.
// This requires the server to be running.

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('--- Running Authentication Tests ---');

  const randomId = Math.floor(Math.random() * 100000);
  const testUser = {
    name: 'Test User',
    email: `test${randomId}@example.com`,
    password: 'password123',
    role: 'rider',
    phone: '1234567890'
  };

  let token = null;

  try {
    // 1. Test Signup
    console.log('\n[1/2] Testing POST /api/auth/signup...');
    const signupResponse = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });

    const signupData = await signupResponse.json();

    if (signupResponse.status !== 201) {
      throw new Error(`Signup failed with status ${signupResponse.status}. Body: ${JSON.stringify(signupData)}`);
    }
    console.log('✅ Signup successful.');
    console.log('Received data:', signupData);

    // 2. Test Login
    console.log('\n[2/2] Testing POST /api/auth/login...');
    const loginResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testUser.email, password: testUser.password }),
    });

    const loginData = await loginResponse.json();

    if (loginResponse.status !== 200) {
      throw new Error(`Login failed with status ${loginResponse.status}. Body: ${JSON.stringify(loginData)}`);
    }
    if (!loginData.token) {
      throw new Error('Login response did not include a JWT token.');
    }
    console.log('✅ Login successful.');
    console.log('Received token:', loginData.token);
    token = loginData.token;

  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error.message);
    process.exit(1); // Exit with an error code
  }

  console.log('\n--- All tests passed successfully! ---');
  // You can optionally add a test to verify the token here
}

runTests();
