import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

//test route
app.get(
  "/",
  asyncHandler(async (req, res) => {
    res.send("Tanishq Clone API is running!");
  })
);

//routes import
import userRouter from "./routes/user.routes.js";
import adminRouter from "./routes/admin.routes.js";
import publicRouter from "./routes/public.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/public", publicRouter);

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(errorHandler);

export { app };
