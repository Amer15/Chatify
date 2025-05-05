import express, { Request, Response } from "express";
import "express-async-errors";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { errorHandler } from "./middlewares/error_handler";
import env from "./env";
import { connectToDB } from "./config/db";
const app = express();
import { userRouter } from "./features/users/routes";
import { messageRouter } from "./features/messages/routes";
import { createServer } from "http";
import { initSocketIO } from "./utils/socket";

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173", "https://new-chatify.netlify.app"],
    credentials: true,
  })
);

const server = createServer(app);

initSocketIO(server);

app.get("/check", async (_: Request, res: Response) => {
  res.status(200).json({
    message: "Server working",
  });
});

[userRouter, messageRouter].forEach((routes) => app.use(`/api/v1`, routes));

app.use(errorHandler);

const PORT = env.PORT || 5000;

server.listen(PORT, () => {
  connectToDB();
  console.log(`server started!!`);
});
