import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import KeywordActionFactory from "../keywordActions/KeywordActionFactory";

export default function keywordHandler(bot: TelegramBot) {
  const factory = new KeywordActionFactory();

  bot.on("message", async (msg: Message) => {
    if (!msg.text) return;
    // const chatId = msg.chat.id;
    // const threadId = msg.message_thread_id || null;
    // const isChannelDiscussionPost =
    //   msg.chat.type === "supergroup" && chatId < 0 && threadId === null;

    const action = factory.getAction(msg.text);
    if (action) {
      await action.execute(bot, msg);
    }
  });
}
