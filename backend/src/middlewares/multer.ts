import { Request } from "express";
import { existsSync, mkdirSync } from "fs";
import multer, { FileFilterCallback } from "multer";
type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

export const demoFileUpload = () =>
  multer({
    storage: fileStorage,
    fileFilter: imgFilter,
  }).any();

const fileStorage = multer.diskStorage({
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: DestinationCallback
  ): void => {
    // TODO: Change to config
    const dest =
      process.cwd() + process.env.NODE_ENV === "development"
        ? "./src/temp/"
        : "./temp/";
    if (!existsSync(dest)) mkdirSync(dest);
    cb(null, dest);
  },

  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: FileNameCallback
  ): void => {
    // TODO: Change to config
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
