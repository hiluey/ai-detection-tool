// C:\Users\giova\ai-detection-tool\src\lib\ai.ts

const API_KEY = '7c0c5579-6e66-4823-a566-d6d38c3c808e';
const DETECT_URL = 'https://ai-detect.undetectable.ai/detect';
const QUERY_URL = 'https://ai-detect.undetectable.ai/query';

export async function detectAIText(text: string) {
    const response = await fetch(DETECT_URL, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            key: API_KEY,
            model: 'xlm_ud_detector',
            retry_count: 0
        })
    });

    if (!response.ok) {
        throw new Error('Failed to detect AI text');
    }

    return await response.json();
}

export async function queryDetectionResult(id: string) {
    const response = await fetch(QUERY_URL, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    });

    if (!response.ok) {
        throw new Error('Failed to query detection result');
    }

    return await response.json();
}