import dotenv from "dotenv";
dotenv.config();

const tcpConfig = {
  port: Number(process.env.TCP_PORT) ?? 8000,
  ip: process.env.IP,
  timeout: 300000,
  maxConnection: 20,
};

export default tcpConfig;
