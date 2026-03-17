import partModel from "../models/part.model";
import { BadRequestError } from "../middlewares/errorHandler";
import db from "@/config/db";
import redis from "@/config/redis";

const CACHE_KEY = "parts:all";

const partController = {
  getAllParts: async () => {
    try {
      // 1. ใช้ Helper getCache ที่เขียน (ระบุ Type เป็น Array ของพาร์ท)
      const cachedParts = await redis.getCache<any[]>(CACHE_KEY);

      if (cachedParts) {
        console.log("⚡ [Redis] Serving from Cache", cachedParts);
        return cachedParts;
      }

      // 2. ถ้าไม่มีใน Cache ให้ดึงจาก Database
      console.log("🏠 [Database] Querying...");
      const parts = await partModel.getAllParts(db, "");

      if (!parts || parts.length === 0) {
        return [];
      }

      // 3. ใช้ Helper setCache เก็บข้อมูล (TTL 1 ชั่วโมงตามที่ตั้ง Default ไว้)
      await redis.setCache(CACHE_KEY, parts);

      return parts;
    } catch (error) {
      console.error("Error in getAllParts:", error);
      throw new BadRequestError({
        message: "ไม่สามารถดึงข้อมูลอะไหล่ได้",
      });
    }
  },
};

export default partController;