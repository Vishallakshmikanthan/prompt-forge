/**
 * IndexNow utility to ping search engines (Bing, Yandex, etc.) 
 * when new content is published.
 */

export async function pingIndexNow(urls: string[]): Promise<void> {
    const key = process.env.INDEXNOW_KEY;
    const host = 'prompt-forge-two-indol.vercel.app';
    const keyLocation = `https://${host}/promptforge-indexnow-key.txt`;

    if (!key) {
        console.warn('[IndexNow] INDEXNOW_KEY not found in environment variables. Skipping ping.');
        return;
    }

    const payload = {
        host,
        key,
        keyLocation,
        urlList: urls,
    };

    try {
        console.log(`[IndexNow] Pinging IndexNow for ${urls.length} URL(s)...`);
        
        const response = await fetch('https://api.bing.com/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(payload),
        });

        if (response.ok) {
            console.log('[IndexNow] Successfully pinged search engines.');
        } else {
            const errorText = await response.text();
            console.error(`[IndexNow] Failed to ping search engines. Status: ${response.status}. Error: ${errorText}`);
        }
    } catch (error) {
        console.error('[IndexNow] Error while pinging IndexNow:', error);
    }
}
