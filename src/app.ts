import express, { Request, Response, urlencoded } from "express";
import cors from "cors";

import router from "./app/routes";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";

const app = express();

const port = 3000;
app.use(cors());

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
