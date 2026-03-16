import dotenv from "dotenv";
dotenv.config();

export const IP = process.env.IP || "localhost";
export const PORT = process.env.PORT || 5000;
const UI_PORTS = [5173, 5174, 5175, 5176, 8080, 8081, 8082, 8083];
export const IP_ORIGIN = UI_PORTS.map((port) => `http://${IP}:${port}`);
export const LOCAL_ORIGIN = UI_PORTS.map((port) => `http://localhost:${port}`);
export const ORIGIN = [...IP_ORIGIN, ...LOCAL_ORIGIN];
