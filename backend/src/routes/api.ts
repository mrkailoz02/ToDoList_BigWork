import express, { Router } from "express";
import partRoute from "./part.route";

const router: Router = express.Router();

router.use("/parts", partRoute);

export default router;