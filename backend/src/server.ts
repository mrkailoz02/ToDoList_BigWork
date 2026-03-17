import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";

// Imports จากไฟล์ในโปรเจค
import { PORT } from "./constant";
import corsOptions from "./config/cors";
import apiRoutes from "./routes/index";
import errorHandler from "./middlewares/errorHandler";
import { connectRedis } from "./config/redis"; // Import ตัวเชื่อมต่อ Redis

const app: Express = express();
const server = http.createServer(app);

// --- 1. Middleware ---
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

// --- 2. Static Files ---
app.use(express.static(path.join(__dirname, "ui")));
app.use("/assets", express.static(path.join(__dirname, "ui/assets")));

// --- 3. API Routes ---
app.use("/api", apiRoutes);

// --- 4. 404 Handler (ต้องอยู่หลัง API Routes) ---
app.all("(.*)", (_: Request, res: Response) => {
  res.status(404).send({ message: "Route Not Found" });
});

// --- 5. Global Error Handler (ต้องอยู่ล่างสุดเสมอ) ---
app.use(errorHandler);

// --- 6. Server Initialization ---
const startServer = async () => {
  try {
    // เชื่อมต่อ Redis ให้สำเร็จก่อนเปิดรับ Request
    await connectRedis();

    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`🚀 API: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();