// db.ts
import { MongoClient, Collection, WithId } from "mongodb";
import type { Message } from "node-telegram-bot-api";
import { log } from "../utils";

const uri =
  `mongodb://${encodeURIComponent(process.env.MONGO_ROOT_USER ?? "root")}` +
  `:${encodeURIComponent(process.env.MONGO_ROOT_PASS ?? "rootpass")}` +
  `@${process.env.MONGO_HOST ?? "mongo"}:${process.env.MONGO_PORT ?? "27017"}` +
  `/${process.env.MONGO_DB_NAME ?? "telegramBot"}?authSource=admin`;

  
const dbName = process.env.MONGODB_DB ?? "telegramBot";
const COLL = "messages";

/** кешируем клиент и коллекцию, чтобы подключаться ровно один раз */
let client: MongoClient | null = null;
let coll: Collection<StoredMsg> | null = null;

export async function getMessagesColl() {
  if (coll) return coll;                          // уже инициализировано

  log('[DATABASE] создаем соединение')
  client = new MongoClient(uri);
  console.log("[DATABASE] URI =", uri);

  await client.connect();                         // второй вызов — noop
  const db = client.db(dbName);

  coll = db.collection<StoredMsg>(COLL);
  await coll.createIndex({ chatId: 1, date: -1 });
  await coll.createIndex({ date: 1 }, { expireAfterSeconds: 604800 });
  return coll;
}



export interface StoredMsg {
  chatId: number;
  messageId: number;
  fromId?: number;
  date: Date;
  text: string | null;
  raw: Message;
}

export async function saveMessage(msg: Message) {
  const collection = await getMessagesColl();
  const doc: StoredMsg = {
    chatId: msg.chat.id,
    messageId: msg.message_id,
    fromId: msg.from?.id,
    date: new Date(msg.date * 1000),
    text: msg.text ?? msg.caption ?? null,
    raw: msg,
  };
  await collection.insertOne(doc);
}

export async function getChatHistory(chatId: number, limit = 10) {
  const collection = await getMessagesColl();
  return collection
    .find({ chatId })
    .sort({ date: -1 })
    .limit(limit)
    .toArray();
}

export async function findMessageById(chatId: number, msgId: number) {
    const c = await getMessagesColl();
    return c.findOne({ chatId, messageId: msgId });
  }
