import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";

export interface KeywordAction {
  /** Паттерны, при совпадении которых выполняется действие */
  patterns: RegExp[];
  /** Выполнение действия */
  execute(bot: TelegramBot, msg: Message): Promise<void>;
}

export interface OpenAIChatMessage {
  role: "user" | "system" | "assistant";
  content: string;
  images?: string[]
}

export interface OpenAIChatCompletionRequest {
  model?: string;
  messages: OpenAIChatMessage[];
  stream: boolean;
}

export interface OpenAIChatCompletionChoice {
  message: {
    role: string;
    content: string;
  };
}

export interface OpenAIChatCompletionResponse {
  choices?: OpenAIChatCompletionChoice[];
}
