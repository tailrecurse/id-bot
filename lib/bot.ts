import type { TelegramMethodMap } from './telegram';

export function getWebhookUrl(): string {
  if (process.env.WEBHOOK_URL) return process.env.WEBHOOK_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/api/webhook`;
  throw new Error('Set WEBHOOK_URL or VERCEL_PROJECT_PRODUCTION_URL');
}

export async function tg<M extends keyof TelegramMethodMap>(
  botToken: string,
  method: M,
  body: TelegramMethodMap[M],
) {
  const res = await fetch(`https://api.telegram.org/bot${botToken}/${method}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    console.error(`${method} failed:`, await res.text());
  }
}
