import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import KeywordActionFactory from "../keywordActions/KeywordActionFactory";

export default function keywordHandler(bot: TelegramBot) {
  const factory = new KeywordActionFactory();

  // Map для хранения времени последнего ответа по chatId
  const lastReply = new Map<number, number>();
  const COOLDOWN_MS = 5 * 60 * 1000; // 5 минут

  bot.on("message", async (msg: Message) => {
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const now = Date.now();
    const lastTime = lastReply.get(chatId);

    // Если уже отвечали и время кулдауна ещё не прошло – ничего не делаем
    if (lastTime && now - lastTime < COOLDOWN_MS) {
      return;
    }

    const action = factory.getAction(msg.text);
    if (action) {
      lastReply.set(chatId, now);      // Запоминаем момент ответа
      setTimeout(() => lastReply.delete(chatId), COOLDOWN_MS); // Чтобы карта не росла
      await action.execute(bot, msg);  // Выполняем действие
    }
  });
}
