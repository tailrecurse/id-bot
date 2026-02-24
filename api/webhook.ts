import type { Update } from '../lib/telegram';
import { tg } from '../lib/bot';

const BOT_TOKEN = process.env.BOT_TOKEN!;
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET!;

export async function POST(req: Request) {
  if (req.headers.get('X-Telegram-Bot-Api-Secret-Token') !== WEBHOOK_SECRET)
    return new Response('Unauthorized', { status: 401 });

  const update = (await req.json()) as Update;
  const msg = update.message;
  if ((!msg?.text?.startsWith('/start') && !msg?.text?.startsWith('/id')) || !msg.from)
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

  await tg(BOT_TOKEN, 'sendMessage', {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
  });

  return new Response('OK');
}
