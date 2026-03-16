import express, { Express, Request, Response } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { PORT } from "./constant";
import path from "path";
import corsOptions from "./config/cors";
const app: Express = express();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(morgan("dev"));

import apiRoutes from "./routes/api";

app.use("/api", apiRoutes);

app.use(express.static(__dirname + "/ui"));
app.use("/assets", express.static(__dirname + "/ui/assets"));

// app.get("/*", (_: Request, res: Response) => {
//   res.sendFile(path.resolve(__dirname, "./ui/index.html"));
// });

import errorHandler from "./middlewares/errorHandler";
app.use(errorHandler);

app.all("*", (_: Request, res: Response) => {
  res.status(404).send({ message: "Not Found" });
});

import http from "http";

const server = http.createServer(app);
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
