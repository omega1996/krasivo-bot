import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import type { KeywordAction } from "../types";

export class SendVideoAction implements KeywordAction {
  patterns: RegExp[];
  private videoId: string;
  private videoOptions: TelegramBot.SendVideoOptions;

  constructor(
    patterns: (string | RegExp)[],
    videoId: string,
    videoOptions: TelegramBot.SendVideoOptions = {}
  ) {
    this.patterns = patterns.map((p) =>
      typeof p === "string" ? new RegExp(p, "i") : p
    );
    this.videoId = videoId;
    this.videoOptions = videoOptions;
  }

  async execute(bot: TelegramBot, msg: Message): Promise<void> {
    const options: TelegramBot.SendVideoOptions = {
      ...this.videoOptions,
      reply_to_message_id: msg.message_id,
    };

    // добавляем threadId, если это не обсуждение канала
    if ((msg.chat as any).is_forum && msg.is_topic_message && msg.message_thread_id) {
      options.message_thread_id = msg.message_thread_id;
    }
    try {
      await bot.sendVideo(msg.chat.id, this.videoId, options);
    } catch (error) {
      console.error(error);
    }
    
  }
}
