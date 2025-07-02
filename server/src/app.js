import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { asyncHandler } from "./utils/asyncHandler.js";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: false,
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

import { errorHandler } from "./middlewares/errorHandler.middleware.js";

app.use(errorHandler);

export { app };
