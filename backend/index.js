// Production-ready entry point for Render
const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'dist', 'server.js');

if (fs.existsSync(distPath)) {
    console.log(`[${new Date().toISOString()}] 🚀 Starting production server from dist/server.js...`);
    require('./dist/server.js');
} else {
    console.log(`[${new Date().toISOString()}] ⚠️ dist/server.js not found, falling back to ts-node...`);
    try {
        require('ts-node/register');
        require('./src/server.ts');
    } catch (e) {
        console.error(`[${new Date().toISOString()}] ❌ CRITICAL ERROR: Could not find compiled server.`);
        process.exit(1);
    }
}
