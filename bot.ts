import TelegramBot from "node-telegram-bot-api";
import { TELEGRAM_TOKEN } from "./config";

export const bot = new TelegramBot(TELEGRAM_TOKEN, { polling: true });

