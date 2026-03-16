import {
  ErrorRequestHandler,
  NextFunction,
  Request,
  RequestHandler,
  Response,
} from "express";
import { ZodError } from "zod";

// --- Types ---
type CustomErrorContent = {
  message: string;
  errorCode: string;
  context?: { [key: string]: any };
};

// --- Base Abstract Class ---
export abstract class CustomError extends Error {
  abstract readonly statusCode: number;
  abstract readonly error: CustomErrorContent;
  abstract readonly logging: boolean;

  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

// --- Subclasses ---

// 400 Bad Request
export class BadRequestError extends CustomError {
  readonly statusCode = 400;
  readonly logging = false;
  readonly error: CustomErrorContent;

  constructor(params?: {
    message?: string;
    errorCode?: string;
    context?: any;
  }) {
    super(params?.message || "Bad Request");
    this.error = {
      message: params?.message || "Bad Request",
      errorCode: params?.errorCode || "BAD_REQUEST",
      context: params?.context || {},
    };
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
}

// 401 Unauthorized
export class UnauthorizedError extends CustomError {
  readonly statusCode = 401;
  readonly logging = false;
  readonly error: CustomErrorContent;

  constructor(params?: {
    message?: string;
    errorCode?: string;
    context?: any;
  }) {
    super(params?.message || "Unauthorized");
    this.error = {
      message: params?.message || "กรุณาล็อกอิน",
      errorCode: params?.errorCode || "UNAUTHORIZED",
      context: params?.context || {},
    };
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// 403 Forbidden
export class ForbiddenError extends CustomError {
  readonly statusCode = 403;
  readonly logging = false;
  readonly error: CustomErrorContent;

  constructor(params?: {
    message?: string;
    errorCode?: string;
    context?: any;
  }) {
    super(params?.message || "Forbidden");
    this.error = {
      message: params?.message || "สิทธิ์การใช้งานไม่ถูกต้อง",
      errorCode: params?.errorCode || "FORBIDDEN",
      context: params?.context || {},
    };
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 Not Found
export class NotFoundError extends CustomError {
  readonly statusCode = 404;
  readonly logging = false;
  readonly error: CustomErrorContent;

  constructor(params?: {
    message?: string;
    errorCode?: string;
    context?: any;
  }) {
    super(params?.message || "Not Found");
    this.error = {
      message: params?.message || "ไม่พบข้อมูล",
      errorCode: params?.errorCode || "NOT_FOUND",
      context: params?.context || {},
    };
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// --- Async Wrapper ---
export const asyncCatch =
  (fn: RequestHandler<any, any, any, any>) =>
  (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// --- Global Error Handler ---
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  // 1. ดักจับ CustomError
  if (err instanceof CustomError) {
    const { statusCode, error, logging, stack } = err;
    if (logging) {
      console.error(
        JSON.stringify({ code: statusCode, error, stack }, null, 2),
      );
    }
    // ใช้ return res... เพื่อให้จบฟังก์ชัน
    res.status(statusCode).send({
      message: error.message,
      error: error.errorCode,
      context: error.context,
    });
    return; // จบการทำงาน
  }

  // 2. ดักจับ ZodError
  if (err instanceof ZodError) {
    res.status(400).send({
      message: "Validation Failed",
      error: "VALIDATION_ERROR",
      context: err.issues.map((e) => ({
        path: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // 3. ดักจับ PostgreSQL Error (กรณีใช้นามสกุล .js ใน import ต้องเช็คตรงนี้ด้วย)
  if ((err as any).code === "23505") {
    res.status(400).send({
      message: "Data already exists",
      error: "DUPLICATE_ENTRY",
    });
    return;
  }

  // 4. Unhandled Errors
  console.error("🔥 Unexpected Error:", err);
  res.status(500).send({
    message: err.message || "Internal Server Error",
    error: "INTERNAL_SERVER_ERROR",
  });
};

export default errorHandler;
