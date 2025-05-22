import { bot } from "../bot.ts";
import keywordHandler from "./keywordHandler";
import supergroupHandler from "./supergroupHandler";
import adminHandler from "./adminHandler.ts";

keywordHandler(bot);
supergroupHandler(bot);
adminHandler(bot)