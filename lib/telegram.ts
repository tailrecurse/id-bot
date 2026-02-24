/** Telegram Bot API types — scoped to what this bot uses. */

export interface User {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
}

export interface Chat {
  id: number;
  type: 'private' | 'group' | 'supergroup' | 'channel';
  title?: string;
  username?: string;
  first_name?: string;
  last_name?: string;
}

export interface MessageEntity {
  type:
    | 'bot_command'
    | 'mention'
    | 'hashtag'
    | 'url'
    | 'bold'
    | 'italic'
    | 'code'
    | 'pre'
    | 'text_link'
    | 'text_mention'
    | string;
  offset: number;
  length: number;
}

export interface Message {
  message_id: number;
  from?: User;
  chat: Chat;
  date: number;
  text?: string;
  entities?: MessageEntity[];
}

export interface Update {
  update_id: number;
  message?: Message;
}

/** Bot API method parameter types */

export interface BotCommand {
  command: string;
  description: string;
}

export interface SetMyCommandsParams {
  commands: BotCommand[];
}

export interface SetWebhookParams {
  url: string;
  secret_token?: string;
  max_connections?: number;
  allowed_updates?: string[];
}

export interface SendMessageParams {
  chat_id: number | string;
  text: string;
  parse_mode?: 'HTML' | 'Markdown' | 'MarkdownV2';
  disable_notification?: boolean;
  reply_to_message_id?: number;
}

/** Map from API method name to its parameter type */
export interface TelegramMethodMap {
  setMyCommands: SetMyCommandsParams;
  setWebhook: SetWebhookParams;
  sendMessage: SendMessageParams;
}
