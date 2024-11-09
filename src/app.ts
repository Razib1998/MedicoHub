import express, { Request, Response, urlencoded } from "express";
import cors from "cors";
import { UserRoutes } from "./app/modules/User/user.route";
import { AdminRoutes } from "./app/modules/Admin/admin.routes";

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

app.use("/api/v1/users", UserRoutes);
app.use("/api/v1/admin", AdminRoutes);
export default app;
