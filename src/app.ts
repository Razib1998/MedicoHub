import express, { NextFunction, Request, Response, urlencoded } from "express";
import cors from "cors";

import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors());
app.use(cookieParser());

// Parsers

app.use(express.json());
app.use(urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Medico Server is Running",
  });
});

app.use("/api/v1", router);
app.use(globalErrorHandler);

app.use(notFound);

export default app;
