import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = process.env;

// 1. สร้าง Client instance
const redisClient = createClient({
  url: `redis://${REDIS_HOST || "localhost"}:${REDIS_PORT || 6379}`,
  password: REDIS_PASSWORD || undefined,
});

// จัดการ Error ของ Redis
redisClient.on("error", (err) => console.error("❌ Redis Client Error", err));
redisClient.on("connect", () => console.log("🚀 Redis Connected"));

// 2. ฟังก์ชันสำหรับเชื่อมต่อ (เรียกใช้ใน server.ts)
export const connectRedis = async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
};

// 3. Helper Methods เพื่อให้ใช้งานง่าย
const setCache = async (key: string, value: any, ttlSeconds: number = 3600) => {
  await redisClient.set(key, JSON.stringify(value), {
    EX: ttlSeconds, // หมดอายุภายใน x วินาที (Default 1 ชม.)
  });
};

const getCache = async <T>(key: string): Promise<T | null> => {
  const data = await redisClient.get(key);
  if (!data) return null;
  return JSON.parse(data) as T;
};

const delCache = async (key: string) => {
  await redisClient.del(key);
};

// สำหรับล้าง Cache เมื่อมีการ Update ข้อมูลพาร์ท (Pattern delete)
const delCacheByPattern = async (pattern: string) => {
  const keys = await redisClient.keys(pattern);
  if (keys.length > 0) {
    await redisClient.del(keys);
  }
};

export default { 
  setCache, 
  getCache, 
  delCache, 
  delCacheByPattern, 
  client: redisClient 
};