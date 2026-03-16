import { PartModel } from "../models/part.model";
import { BadRequestError } from "../middlewares/errorHandler";
import db from "@/config/db";
import { NextFunction } from "express";

export const getAllParts = async () => {
  try {
    const parts = await PartModel.getAllParts(db, "");
    console.log("Data fetched from DB:", parts.length);

    if (!parts) {
      throw new BadRequestError({ message: "ไม่พบข้อมูลอะไหล่" });
    }

    return parts;
  } catch (error) {
    console.error("Error fetching parts:", error);
    throw new BadRequestError({
      message: "เกิดข้อผิดพลาดในการดึงข้อมูลอะไหล่",
    });
  }
};
