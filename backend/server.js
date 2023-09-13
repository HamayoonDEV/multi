import express from "express";
import { PORT } from "./config/index.js";
import connectDb from "./database/database.js";
import router from "./routes/index.js";
import handleError from "./middleWare/handleError.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

const app = express();
app.use(cookieParser());
app.use(cors(corsOptions));
connectDb();

app.use(express.json());
app.use(router);
app.use("/storage", express.static("storage"));
app.use(handleError);
app.listen(PORT, console.log(`server is running on PORT:${PORT}`));
