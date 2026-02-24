import { tg, getWebhookUrl } from '../lib/bot.js';

const BOT_TOKEN = process.env.BOT_TOKEN;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

if (!BOT_TOKEN || !WEBHOOK_SECRET) {
  console.error('Missing BOT_TOKEN or WEBHOOK_SECRET');
  process.exit(1);
}

const webhookUrl = getWebhookUrl();

await tg(BOT_TOKEN, 'setMyCommands', {
  commands: [
    { command: 'start', description: 'Show chat and user IDs' },
    { command: 'id', description: 'Show chat and user IDs' },
  ],
});

await tg(BOT_TOKEN, 'setWebhook', { url: webhookUrl, secret_token: WEBHOOK_SECRET });

console.log(`Webhook set to ${webhookUrl}`);
