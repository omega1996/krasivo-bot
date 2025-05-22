import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";
import {
  ADMIN_CHAT_ID,
  getCurrentModel,
  setCurrentModel,
  API_URL,
} from "../config";
import fetch from "node-fetch";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { escapeHtml } from "../utils";


export default function adminHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    // Отвечаем только в личке админа
    if (msg.chat.id !== ADMIN_CHAT_ID) return;

    // Если пришло видео — возвращаем его file_id
    if (msg.video || msg.document) {
      await bot.sendMessage(
        msg.chat.id,
        `📎 file_id: <code>${escapeHtml(msg.video?.file_id || msg.document?.file_id || 'no file')}</code>`,
        {
          reply_to_message_id: msg.message_id,
          parse_mode: "HTML",
        }
      );
      return;
    }

    // Если пришёл текст — считаем это именем модели
    if (msg.text) {
      const requestedModel = msg.text.trim();
      if (!requestedModel) return;

      const previousModel = getCurrentModel();
      setCurrentModel(requestedModel);

      try {
        // Пробуем сделать минимальный запрос «ping»
        const testBody: OpenAIChatCompletionRequest = {
          model: requestedModel,
          messages: [
            {
              role: "user",
              content: "ping",
            },
          ],
          stream: false,
        };

        const res = await fetch(`${API_URL}chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(testBody),
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${await res.text()}`);
        }

        const _json = (await res.json()) as
          | OpenAIChatCompletionResponse
          | { error: string };

        if ("error" in _json) {
          throw new Error(_json.error);
        }

        await bot.sendMessage(
          msg.chat.id,
          `✅ Модель обновлена. Текущая модель: <code>${escapeHtml(
            requestedModel
          )}</code>`,
          {
            reply_to_message_id: msg.message_id,
            parse_mode: "HTML",
          }
        );
      } catch (err) {
        console.error("Ошибка проверки модели:", err);
        // Откатываемся к предыдущей модели
        setCurrentModel(previousModel);

        await bot.sendMessage(
          msg.chat.id,
          `❌ Не удалось использовать модель <code>${escapeHtml(
            requestedModel
          )}</code>. Остаюсь на <code>${escapeHtml(previousModel)}</code>`,
          {
            reply_to_message_id: msg.message_id,
            parse_mode: "HTML",
          }
        );
      }
    }
  });
}
