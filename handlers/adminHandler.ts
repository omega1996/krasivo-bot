// src/handlers/admin.ts
import TelegramBot from "node-telegram-bot-api";
import type { Message } from "node-telegram-bot-api";

import {
  ADMIN_CHAT_ID,
  API_URL,
  getCurrentModel,
  patchSettings,
} from "../config";
import { getSettings } from "../db";

import type {
  OpenAIChatCompletionRequest,
  OpenAIChatCompletionResponse,
} from "../types";
import { escapeHtml } from "../utils";

/* ────────────────────────────────────────────────────────── helpers ── */

async function pingModel(model: string) {
  const body: OpenAIChatCompletionRequest = {
    model,
    messages: [{ role: "user", content: "ping" }],
    stream: false,
  };

  const res = await fetch(`${API_URL}chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as
    | OpenAIChatCompletionResponse
    | { error: string };

  if ("error" in json) throw new Error(json.error);
}

/* ────────────────────────────────────────────────────────── handler ── */

export default function adminHandler(bot: TelegramBot) {
  bot.on("message", async (msg: Message) => {
    /* отвечаем только в личке админа */
    if (msg.chat.id !== ADMIN_CHAT_ID) return;

    /* ⇢ отдали file_id, если прислали файл/видео */
    if (msg.video || msg.document) {
      await bot.sendMessage(
        msg.chat.id,
        `📎 file_id: <code>${escapeHtml(
          msg.video?.file_id || msg.document?.file_id || "no file"
        )}</code>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
      return;
    }

    /* дальше — работа со строковыми командами */
    if (!msg.text) return;
    const text = msg.text.trim();
    if (!text.startsWith("/")) return; // не команда

    const [cmd, ...restArr] = text.split(" ");
    const rest = restArr.join(" ").trim();

    /* ---------------------------------------------------------------- */
    /* /model */
    if (cmd === "/model") {
      const current = await getCurrentModel();

      if (!rest) {
        await bot.sendMessage(
          msg.chat.id,
          `ℹ️ Текущая модель: <code>${escapeHtml(current)}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
        return;
      }

      const requested = rest;
      try {
        await pingModel(requested); // проверили, что жива
        await patchSettings({ model: requested });
        await bot.sendMessage(
          msg.chat.id,
          `✅ Модель обновлена: <code>${escapeHtml(requested)}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
      } catch (err) {
        console.error("Ошибка проверки модели:", err);
        await bot.sendMessage(
          msg.chat.id,
          `❌ Не удалось использовать <code>${escapeHtml(
            requested
          )}</code>. Остаюсь на <code>${escapeHtml(current)}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
      }
      return;
    }

    /* ---------------------------------------------------------------- */
    /* /prompt */
    if (cmd === "/prompt") {
      const settings = await getSettings();

      if (!rest) {
        await bot.sendMessage(
          msg.chat.id,
          `ℹ️ Текущий system prompt:\n<code>${escapeHtml(
            settings.systemPrompt
          )}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
        return;
      }

      await patchSettings({ systemPrompt: rest });
      await bot.sendMessage(
        msg.chat.id,
        "✅ System prompt обновлён.",
        { reply_to_message_id: msg.message_id }
      );
      return;
    }

    /* ---------------------------------------------------------------- */
    /* /cooldown */
    if (cmd === "/cooldown") {
      const settings = await getSettings();

      if (!rest) {
        await bot.sendMessage(
          msg.chat.id,
          `ℹ️ Текущий COOLDOWN_MS: <code>${settings.cooldownMs}</code>`,
          { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
        );
        return;
      }

      const value = Number(rest);
      if (!Number.isFinite(value) || value < 0) {
        await bot.sendMessage(
          msg.chat.id,
          "❌ Укажите положительное число миллисекунд, напр. /cooldown 300000",
          { reply_to_message_id: msg.message_id }
        );
        return;
      }

      await patchSettings({ cooldownMs: value });
      await bot.sendMessage(
        msg.chat.id,
        `✅ COOLDOWN_MS установлен: <code>${value}</code>`,
        { reply_to_message_id: msg.message_id, parse_mode: "HTML" }
      );
      return;
    }
  });
}
