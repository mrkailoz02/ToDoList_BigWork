import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";
import { BadRequestError } from "./errorHandler";
import { capitalizeString } from "@/utils/utils";

const validator =
  (schema: z.ZodObject<any, any>) =>
  (req: Request, _: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const context = error.errors.map((issue: any) => ({
          message: `${issue.path.join(".")} is ${issue.message}`,
        }));
        const errorMessages = error.errors
          .map((issue: any) => capitalizeString(issue.path.join(".")))
          .join(", ");

        console.error({ error: "validation error", context: context });

        throw new BadRequestError({ message: `กรุณากรอก ${errorMessages}` });
      }
      next(error);
    }
  };

export default validator;
