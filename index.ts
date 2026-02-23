import type { TelegramMethodMap, Update } from './telegram.ts';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_URL = process.env.WEBHOOK_URL;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!BOT_TOKEN || !WEBHOOK_URL || !WEBHOOK_SECRET) {
  console.error('Missing BOT_TOKEN, WEBHOOK_URL, or WEBHOOK_SECRET');
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
  commands: [
    { command: 'start', description: 'Show chat and user IDs' },
    { command: 'id', description: 'Show chat and user IDs' },
  ],
});

await tg('setWebhook', { url: WEBHOOK_URL, secret_token: WEBHOOK_SECRET });

console.log(`Webhook set to ${WEBHOOK_URL}`);

const server = Bun.serve({
  port: Number(process.env.PORT) || 3000,
  async fetch(req) {
    if (req.method !== 'POST') return new Response('OK');
    if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== WEBHOOK_SECRET)
      return new Response('Unauthorized', { status: 401 });

    const update = (await req.json()) as Update;
    const msg = update.message;
    if (!msg?.text?.startsWith('/start') || !msg?.text?.startsWith('/id') || !msg.from)
      return new Response('OK');

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
