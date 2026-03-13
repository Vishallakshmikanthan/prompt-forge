
const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
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
    } catch (error) {
        console.error('Signup Failed:', error.message);
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
    } catch (error) {
        console.error('Login Failed:', error.message);
    }

    console.log('\n--- Verifying Hashed Password in DB ---');
    try {
        const dbUser = await prisma.user.findUnique({
            where: { email: testUser.email }
        });

        if (dbUser) {
            console.log('User found in DB');
            console.log('Hashed Password:', dbUser.password_hash);
            const isMatch = await bcrypt.compare(testUser.password, dbUser.password_hash || '');
            console.log('Password Hash Match:', isMatch);
        } else {
            console.log('User not found in DB');
        }
    } catch (error) {
        console.error('DB Verification Failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

runTest();
