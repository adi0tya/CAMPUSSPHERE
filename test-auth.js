// Test Authentication Script
// Run this with: node test-auth.js

const BACKEND_URL = 'https://your-backend-url.onrender.com'; // UPDATE THIS!

async function testBackend() {
  console.log('🧪 Testing CampusSphere ERP Authentication\n');
  console.log('Backend URL:', BACKEND_URL);
  console.log('=' .repeat(60));

  // Test 1: Health Check
  console.log('\n📡 Test 1: Health Check');
  try {
    const response = await fetch(`${BACKEND_URL}/api/health`);
    const data = await response.json();
    console.log('✅ Status:', response.status);
    console.log('✅ Response:', data);
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('⚠️  Backend is not accessible!');
    return;
  }

  // Test 2: Register Student (No Secret Code)
  console.log('\n👨‍🎓 Test 2: Register Student');
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `test${Date.now()}@example.com`,
        phone: '1234567890',
        password: 'test123',
        confirmPassword: 'test123',
        role: 'student'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.success) {
      console.log('✅ Registration successful!');
      console.log('✅ Token received:', data.token ? 'Yes' : 'No');
      console.log('✅ User:', data.user);
    } else {
      console.log('❌ Registration failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 3: Register Admin (With Secret Code)
  console.log('\n👨‍💼 Test 3: Register Admin (with secret code)');
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Admin',
        email: `admin${Date.now()}@example.com`,
        phone: '9876543210',
        password: 'admin123',
        confirmPassword: 'admin123',
        role: 'admin',
        secretCode: 'CAMPUSSPHERE_ADMIN_2026'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.success) {
      console.log('✅ Admin registration successful!');
      console.log('✅ Token received:', data.token ? 'Yes' : 'No');
    } else {
      console.log('❌ Admin registration failed:', data.message);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  // Test 4: Login with Seeded Account
  console.log('\n🔐 Test 4: Login with Seeded Account');
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@campussphere.com',
        password: 'admin123',
        role: 'admin'
      })
    });
    const data = await response.json();
    console.log('Status:', response.status);
    if (data.success) {
      console.log('✅ Login successful!');
      console.log('✅ User:', data.user);
    } else {
      console.log('❌ Login failed:', data.message);
      console.log('⚠️  Database might not be seeded. Run: npm run seed');
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }

  console.log('\n' + '='.repeat(60));
  console.log('🎯 Testing Complete!\n');
}

// Run tests
testBackend().catch(console.error);
