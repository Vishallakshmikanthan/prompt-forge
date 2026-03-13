
const API_URL = 'http://localhost:4000/api';

async function runTest() {
    const testUser = {
        username: `testuser_${Date.now()}`,
        email: `test_${Date.now()}@example.com`,
        password: 'Password123!'
    };

    console.log('--- Testing Signup ---');
    try {
        const signupRes = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const signupData = await signupRes.json();
        console.log('Signup Status:', signupRes.status);
        console.log('Signup Response:', signupData);
        
        if (signupRes.status === 201) {
            console.log('Signup SUCCESS');
        } else {
            console.log('Signup FAILED');
        }
    } catch (error) {
        console.error('Signup Error:', error.message);
    }

    console.log('\n--- Testing Login ---');
    try {
        const loginRes = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: testUser.email,
                password: testUser.password
            })
        });
        const loginData = await loginRes.json();
        console.log('Login Status:', loginRes.status);
        console.log('Login Response:', loginData);
        
        if (loginRes.status === 200) {
            console.log('Login SUCCESS');
        } else {
            console.log('Login FAILED');
        }
    } catch (error) {
        console.error('Login Error:', error.message);
    }
}

runTest();
