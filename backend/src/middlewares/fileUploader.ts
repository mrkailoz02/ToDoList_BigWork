import multer from "multer";
import path from "path";
import fs from "fs";
import { BadRequestError } from "./errorHandler";

// 1. กำหนดที่เก็บไฟล์ (Storage)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "uploads/parts/"; // แยกโฟลเดอร์ตามประเภทงาน
    // ตรวจสอบว่ามีโฟลเดอร์ไหม ถ้าไม่มีให้สร้าง
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // ตั้งชื่อไฟล์: part-[timestamp]-[random].[ext]
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 2. ตัวกรองประเภทไฟล์ (File Filter)
const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const isMatch = allowedTypes.test(path.extname(file.originalname).toLowerCase()) && 
                  allowedTypes.test(file.mimetype);

  if (isMatch) {
    return cb(null, true);
  } else {
    cb(new BadRequestError({ message: "รองรับเฉพาะไฟล์รูปภาพ (jpg, png, gif) และ PDF เท่านั้น" }), false);
  }
};

// 3. สร้าง Instance ของ Multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาด 5MB
  },
});

// 4. Wrapper สำหรับจัดการ Error ของ Multer เอง (เช่น ไฟล์ใหญ่เกิน)
const fileUploader = (fieldName: string) => {
  const uploadSingle = upload.single(fieldName);

  return (req: any, res: any, next: any) => {
    uploadSingle(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === "LIMIT_FILE_SIZE") {
          return next(new BadRequestError({ message: "ไฟล์มีขนาดใหญ่เกินไป (จำกัดไม่เกิน 5MB)" }));
        }
        return next(new BadRequestError({ message: err.message }));
      } else if (err) {
        return next(err);
      }
      next();
    });
  };
};

export default fileUploader;