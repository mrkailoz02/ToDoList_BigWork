import { CorsOptions } from "cors";
import { ORIGIN } from "../constant";

const corsOptions: CorsOptions = {
  origin: ORIGIN,
  optionsSuccessStatus: 200, // For legacy browser support
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
};

export default corsOptions;
