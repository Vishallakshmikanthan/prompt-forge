const http = require('http');

const checkHeaders = () => {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:4000/api/health', (res) => {
            console.log('--- Security Headers ---');
            console.log('X-Content-Type-Options:', res.headers['x-content-type-options']);
            console.log('Content-Security-Policy:', res.headers['content-security-policy']);
            console.log('X-Frame-Options:', res.headers['x-frame-options']);
            console.log('Referrer-Policy:', res.headers['referrer-policy']);
            resolve();
        }).on('error', reject);
    });
};

const checkAuth = () => {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ voteType: 'upvote' });
        const authOptions = {
            hostname: 'localhost',
            port: 4000,
            path: '/api/prompts/123/vote',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': postData.length,
            },
        };

        const req = http.request(authOptions, (res) => {
            console.log('\n--- Authentication Enforcement ---');
            console.log('POST /api/prompts/123/vote status:', res.statusCode);
            if (res.statusCode === 401) {
                console.log('SUCCESS: Authentication blocked as expected.');
            } else {
                console.log('FAILURE: Authentication NOT blocked.');
            }
            resolve();
        }).on('error', reject);
        req.write(postData);
        req.end();
    });
};

const checkSearchValidation = () => {
    return new Promise((resolve, reject) => {
        http.get('http://localhost:4000/api/search?q=a', (res) => {
            console.log('\n--- Search Validation ---');
            console.log('GET /api/search?q=a status:', res.statusCode);
            if (res.statusCode === 400) {
                console.log('SUCCESS: Short query blocked as expected.');
            } else {
                console.log('FAILURE: Short query NOT blocked.');
            }
            resolve();
        }).on('error', reject);
    });
};

async function run() {
    try {
        await checkHeaders();
        await checkAuth();
        await checkSearchValidation();
    } catch (err) {
        console.error('Error during verification:', err.message);
    }
}

run();
