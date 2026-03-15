// Production-ready entry point for Render
const path = require('path');
const fs = require('fs');

const distPath = path.join(__dirname, 'dist', 'server.js');

if (fs.existsSync(distPath)) {
    console.log('🚀 Starting production server from dist/server.js...');
    require('./dist/server.js');
} else {
    console.log('⚠️ dist/server.js not found, falling back to ts-node (development only)...');
    try {
        require('ts-node/register');
        require('./src/server.ts');
    } catch (e) {
        console.error('❌ CRITICAL ERROR: Could not find compiled server and ts-node is not available.');
        process.exit(1);
    }
}
