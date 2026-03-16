import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const planDemoFileUpload = () =>
  multer({
    storage: fileStorage,
    fileFilter: imgFilter,
  }).any();

//filter ไฟล์ Excel
const excelFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  //ตรวจสอบ Type ของไฟล์ (.xlsx, .xls)
  if (
    file.mimetype ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" || // .xlsx
    file.mimetype === "application/vnd.ms-excel" // .xls
  ) {
    callback(null, true); // อนุญาตให้อัปโหลด
  } else {
    // ส่ง Error กลับไปหากไฟล์ไม่ใช่ Excel
    callback(new Error("Only .xlsx and .xls files are allowed!"));
  }
};

//upload file excel
export const planExcelFileUpload = () =>
  multer({
    storage: fileStorage,
    fileFilter: excelFilter,
  }).any();

const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    // TODO: Change to config
    const destPath =
      process.env.NODE_ENV === "development"
        ? "./src/temp/plan-upload/"
        : "./temp/plan-upload/";

    const dest = path.join(process.cwd(), destPath);
    if (!existsSync(dest)) mkdirSync(dest);
    cb(null, dest);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    // UTF 8 read Thai
    cb(null, file.originalname);
  },
});

const imgFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: FileFilterCallback
): void => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
