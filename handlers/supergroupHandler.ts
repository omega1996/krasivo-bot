import TelegramBot from "node-telegram-bot-api";
import type { Message, PhotoSize, Document } from "node-telegram-bot-api";
import type { RequestInit } from "node-fetch";
import fetch from "node-fetch";
import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { API_URL, getCurrentModel, getSystemPrompt } from "../config"; // ✨ добавили getSystemPrompt
import { escapeV2, extractImage, log } from "../utils";
import {
  saveMessage,
  getChatHistory,
  findMessageById,
  getTodayStats,
} from "../db";
import { openai } from "../utils/openai";

export default function supergroupHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    log("— New message —", {
      chatId: msg.chat.id,
      msgId: msg.message_id,
      text: msg.text || msg.caption,
    });

    // Обработка команды /stats
    if (msg.text && msg.text.startsWith("/stats")) {
      try {
        const stats = await getTodayStats(msg.chat.id);

        // Получаем топ-3 пользователей
        const topUsers = stats.userStats.slice(0, 3);

        let topUsersText = "Топ-3 активных пользователей:\n";
        if (topUsers.length === 0) {
          topUsersText += "Пока никто не писал 😴";
        } else {
          topUsers.forEach((user, index) => {
            const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉";
            topUsersText += `${medal} ${user.userName}: ${user.messageCount} сообщений\n`;
          });
        }

        const statsText =
          "📊 Статистика за сегодня:\n\n" +
          `Сообщений: ${stats.totalMessages}\n` +
          `Стикеров: ${stats.stickers}\n` +
          `Гифок: ${stats.gifs}\n` +
          `Фото: ${stats.photos}\n` +
          `Видео: ${stats.videos}\n\n` +
          topUsersText;

        await bot.sendMessage(msg.chat.id, statsText, {
          reply_to_message_id: msg.message_id,
        });
        return;
      } catch (err) {
        console.error("Ошибка при получении статистики:", err);
        await bot.sendMessage(
          msg.chat.id,
          "❌ Ошибка при получении статистики",
          { reply_to_message_id: msg.message_id }
        );
        return;
      }
    }

    try {
      await saveMessage(msg);
    } catch (dbErr) {
      console.error("DB save error", dbErr);
    }

    try {
      console.time("handler_total");

      const chatId = msg.chat.id;
      const threadId = msg.message_thread_id || null;
      const me = await bot.getMe();

      const isChannelDiscussionPost =
        msg.chat.type === "supergroup" && chatId < 0 && threadId === null;
      const isAnonymousChannelMessage =
        !!msg.sender_chat && msg.sender_chat.type === "channel";
      const isReplyToMe = msg.reply_to_message?.from?.id === me.id;

      // Получаем данные о самой группе, чтобы узнать её linked_chat_id
      log("Fetching group chat info…");
      const groupChat = await bot.getChat(msg.chat.id);
      const linkedChatId = (groupChat as any).linked_chat_id;
      log("linkedChatId", linkedChatId);

      const textContent = msg.text || msg.caption || "";
      const directAsk = textContent.toLowerCase().startsWith("бот");
      if (
        (!linkedChatId || msg.sender_chat?.id !== linkedChatId) &&
        !directAsk &&
        !isReplyToMe
      ) {
        log("Not addressed to bot, skipping.");
        return;
      }

      console.time("extract_image");
      // Сначала ищем картинку в самом сообщении
      let base64DataUrl: string | null = await extractImage(msg, bot);
      // Если нет — пробуем найти изображение в сообщении, на которое отвечаем
      if (!base64DataUrl && msg.reply_to_message) {
        base64DataUrl = await extractImage(msg.reply_to_message, bot);
      }
      console.timeEnd("extract_image");
      log("base64DataUrl present?", !!base64DataUrl);

      const SYSTEM_PROMPT = await getSystemPrompt();

      const history = await getChatHistory(msg.chat.id, 10);
      // Строим сообщения под chat‑completion
      const messages: any[] = [{ role: "system", content: SYSTEM_PROMPT }];

      for (const h of history.reverse()) {
        console.log("Автор: ", h.authorName);
        const role = h.fromId === me.id ? "assistant" : "user";
        let payloadText =
          role === "user" && h.authorName
            ? `пользователь с именем ${h.authorName} пишет: ${h.text ?? ""}`
            : h.text ?? "";

        if (h.raw.reply_to_message) {
          const parentId = h.raw.reply_to_message.message_id;
          const parentDoc = await findMessageById(chatId, parentId);

          if (parentDoc?.text) {
            const who = parentDoc.authorName ?? "Сообщение";
            payloadText =
              payloadText +
              `. Пользователь отвечает на сообщение ${who}:\n«${parentDoc.text}»\n\n`;
          }
        }
        messages.push({ role, content: payloadText });
      }

      if (base64DataUrl) {
        messages.push({
          role: "user",
          content: [
            { type: "text", text: textContent || "Прокомментируй изображение" },
            { type: "image_url", image_url: { url: base64DataUrl } },
          ],
        });
      }

      log("Messages for OpenAI", messages);

      const needLLM =
        (isChannelDiscussionPost && isAnonymousChannelMessage) ||
        directAsk ||
        isReplyToMe;

      if (!needLLM) {
        log("No need to call LLM (conditions not met)");
        return;
      }

      // Ставим реакцию 👀, чтобы показать, что ответ обрабатывается
      try {
        const reaction = [{ type: "emoji", emoji: "👀" }];
        // @ts-ignore
        await bot.setMessageReaction(chatId, msg.message_id, {
          reaction: JSON.stringify(reaction),
        });
      } catch (reactionErr) {
        console.error("Не удалось добавить реакцию", reactionErr);
      }

      // Делаем запрос к OpenAI

      let replyText = "Тсссс, я сплю, не буди";
      try {
        const stream = await openai.chat.completions.create({
          model: await getCurrentModel(),
          messages,
          stream: true,
        });

        for await (const chunk of stream) {
          const token = chunk.choices?.[0]?.delta?.content;
          console.log("token", token);
          if (token) replyText += token;
        }
      } catch (fetchErr: any) {
        console.error("OpenAI fetch error", fetchErr);

        // Определяем тип ошибки и устанавливаем соответствующий ответ
        if (
          fetchErr.name === "APIConnectionTimeoutError" ||
          fetchErr.message?.includes("timeout")
        ) {
          replyText =
            "⏰ Извините, запрос занял слишком много времени. Попробуйте еще раз.";
        } else if (fetchErr.status === 429) {
          replyText =
            "🚫 Слишком много запросов. Подождите немного и попробуйте снова.";
        } else if (fetchErr.status === 401) {
          replyText =
            "🔑 Проблема с авторизацией API. Обратитесь к администратору.";
        } else if (fetchErr.status >= 500) {
          replyText = "🔧 Сервер временно недоступен. Попробуйте позже.";
        } else {
          replyText =
            "❌ Произошла ошибка при обработке запроса. Попробуйте еще раз.";
        }
      }

      // Отправляем ответ
      try {
        const botReply = await bot.sendMessage(chatId, escapeV2(replyText), {
          reply_to_message_id: msg.message_id,
          parse_mode: "MarkdownV2",
        });

        try {
          await saveMessage(botReply); // теперь история полная
        } catch (dbErr) {
          console.error("DB save error (bot reply)", dbErr);
        }
      } catch (sendErr) {
        console.error("Ошибка отправки сообщения", sendErr);
      }

      console.timeEnd("handler_total");
    } catch (err) {
      console.error("Ошибка при обработке сообщения (outer)", err);
    }
  });
}
