import type { TelegramMethodMap, Update } from './telegram.ts';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

if (!BOT_TOKEN || !WEBHOOK_URL) {
    console.error('Missing BOT_TOKEN or WEBHOOK_URL');
    process.exit(1);
}

const API = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function tg<M extends keyof TelegramMethodMap>(method: M, body: TelegramMethodMap[M]) {
    const res = await fetch(`${API}/${method}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    });
    if (!res.ok) {
        console.error(`${method} failed:`, await res.text());
    }
}

await tg('setMyCommands', {
    commands: [{ command: 'id', description: 'Show chat and user IDs' }],
});

await tg('setWebhook', { url: WEBHOOK_URL });

console.log(`Webhook set to ${WEBHOOK_URL}`);

const server = Bun.serve({
    port: Number(process.env.PORT) || 3000,
    async fetch(req) {
        if (req.method !== 'POST') return new Response('OK');

        const update = await req.json() as Update;
        const msg = update.message;
        if (!msg?.text?.startsWith('/id') || !msg.from) return new Response('OK');

        const chatId = msg.chat.id;
        const userId = msg.from.id;
        const chatType = msg.chat.type;

        let text: string;
        if (chatType === 'private') {
            text = `Your user ID: <code>${userId}</code>`;
        } else {
            text = `Group ID: <code>${chatId}</code>\nYour user ID: <code>${userId}</code>`;
        }

        await tg('sendMessage', {
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        });

        return new Response('OK');
    },
});

console.log(`Listening on port ${server.port}`);
