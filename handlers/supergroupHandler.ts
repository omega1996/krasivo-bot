import TelegramBot from "node-telegram-bot-api";
import type { Message, PhotoSize, Document } from "node-telegram-bot-api";
import fetch from "node-fetch";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { API_URL, getCurrentModel } from "../config";
import { toBase64DataUrl, toBase64String } from "../utils";

const SYSTEM_PROMPT =
  "Ты дружелюбный русскоязычный ассистент. Отвечай живо, по теме и поддерживай диалог.  " +
  "Если к сообщению прикреплено изображение, опиши, что на нём, и свяжи описание с текстом.";

export default function supergroupHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    try {
      const chatId = msg.chat.id;
      const threadId = msg.message_thread_id || null;

      const isChannelDiscussionPost =
        msg.chat.type === "supergroup" && chatId < 0 && threadId === null;

      const isAnonymousChannelMessage =
        !!msg.sender_chat && msg.sender_chat.type === "channel";

      // Получаем данные о самой группе, чтобы узнать её linked_chat_id
      const groupChat = await bot.getChat(msg.chat.id);
      const linkedChatId = groupChat.linked_chat_id;

      const textContent = msg.text || msg.caption || "";

      const directAsk = textContent.toLowerCase().startsWith("бот")
      if (
        (!linkedChatId || msg.sender_chat?.id !== linkedChatId) &&
        !directAsk
      ) {
        return; // нет привязанного канала
      }

      let base64DataUrl: string | null = null;
      if (msg.photo && msg.photo.length) {
        const largest = msg.photo.at(-1) as PhotoSize;
        const link = await bot.getFileLink(largest.file_id);
        base64DataUrl = await toBase64DataUrl(link);
      } else if (
        msg.document &&
        (msg.document as Document).mime_type?.startsWith("image/")
      ) {
        const link = await bot.getFileLink(msg.document.file_id);
        base64DataUrl = await toBase64DataUrl(link);
      }

      // Строим сообщения под чат‑completion
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

      if (base64DataUrl) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: textContent || "Прокомментируй изображение" },
            { type: "image_url", image_url: { url: base64DataUrl } },
          ],
        });
      } else {
        messages.push({ role: "user", content: textContent });
      }

      if (isChannelDiscussionPost && isAnonymousChannelMessage || directAsk) {
        const text = msg.text || "";

        const requestBody: OpenAIChatCompletionRequest = {
          model: getCurrentModel(),
          messages,
          stream: false,
        };

        const response = await fetch(`${API_URL}chat/completions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify(requestBody),
        });

        const data = (await response.json()) as OpenAIChatCompletionResponse;

        if (!data?.choices?.[0]?.message?.content) {
          console.error("Не удалось получить ответ от API", data);
        }

        const replyText =
          data?.choices?.[0]?.message?.content ||
          "Не удалось получить ответ от API";

        await bot.sendMessage(msg.chat.id, replyText, {
          reply_to_message_id: msg.message_id,
        });
      }
    } catch (err) {
      console.error("Ошибка при обработке сообщения:", err);
    }
  });
}



