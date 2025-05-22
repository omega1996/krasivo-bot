import "./handlers";
import { bot } from "./bot";

console.log("🤖 Bot started. Waiting for messages…");
process.on("SIGINT", () => bot.stopPolling());
