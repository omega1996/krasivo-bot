// src/handlers/keywordHandler.ts
import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import KeywordActionFactory from "../keywordActions/KeywordActionFactory";
import { getCooldownMs } from "../config";

export default function keywordHandler(bot: TelegramBot) {
  const factory = new KeywordActionFactory();

  /* карта последних ответов по chatId */
  const lastReply = new Map<number, number>();

  bot.on("message", async (msg: Message) => {
    if (!msg.text) return;

    const chatId = msg.chat.id;
    const now = Date.now();

    /* получаем актуальное значение из кэша (обновляется раз в 60 с) */
    const COOLDOWN_MS = await getCooldownMs();

    const lastTime = lastReply.get(chatId);
    if (lastTime && now - lastTime < COOLDOWN_MS) return; // ещё рано

    const action = factory.getAction(msg.text);
    if (!action) return;

    lastReply.set(chatId, now);
    setTimeout(() => lastReply.delete(chatId), COOLDOWN_MS); // авто‑очистка

    await action.execute(bot, msg);
  });
}
