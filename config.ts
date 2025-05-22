import fs from "fs";
import path from "path";



/** Путь к файлу, где хранится выбранная модель */
const MODEL_PATH = path.resolve(process.cwd(), "data", "model.txt");

/**
 * Текущая модель OpenAI. Сначала пытаемся прочитать из файла MODEL_PATH,
 * иначе берём из переменной среды OPENAI_MODEL или fallback‑значение.
 */
let currentModel: string = (() => {
  try {
    if (fs.existsSync(MODEL_PATH)) {
      return fs.readFileSync(MODEL_PATH, "utf-8").trim();
    }
  } catch {
    /* ignore */
  }
  return process.env.MODEL || "qwen2-vl-7b-instruct";
})();

/** Получить активную модель */
export function getCurrentModel(): string {
  return `${currentModel}`;
}

/** Установить новую активную модель и сохранить на диск */
export function setCurrentModel(model: string): void {
  currentModel = model.trim();
  try {
    fs.mkdirSync(path.dirname(MODEL_PATH), { recursive: true });
    fs.writeFileSync(MODEL_PATH, currentModel, "utf-8");
  } catch (err) {
    console.error("Не удалось сохранить модель на диск:", err);
  }
}



export const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || "";
export const API_URL = process.env.API_URL || "";
export const ADMIN_CHAT_ID = parseInt(process.env.ADMIN_CHAT_ID || '0') || 0;

