import express = require("express");
import { default as healthRoutes } from "./modules/health/health.routes";
import { default as studentsRoutes } from "./modules/students/students.routes";
import * as dotenv from "dotenv";
dotenv.config();
import "./database";
import { errorHandler } from "./common/middlewares/error-handler";

const app: express.Express = express();
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/students", studentsRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
