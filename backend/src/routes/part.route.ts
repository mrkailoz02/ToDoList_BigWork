import { Router, Request, Response } from "express";
import partController from "../controller/part.controller";
import { asyncCatch } from "../middlewares/errorHandler";

const router = Router();

// GET: /api/parts
router.get(
  "/",
  asyncCatch(async (req: Request, res: Response) => {
    const result = await partController.getAllParts();
    res.status(200).send({ message: "Get data successfully.", data: result });
  }),
);

export default router;