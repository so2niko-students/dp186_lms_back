import express = require("express");
import { default as healthRoutes } from "./modules/health/health.routes";
import { router as studentsRoutes } from "./modules/students/students.routes";
import * as dotenv from "dotenv";
dotenv.config();
import "./database";
import { errorHandler } from "./common/middlewares/errors.middleware";

const app: express.Express = express();
app.use(express.json());

app.use("/api/v1/health", healthRoutes);
app.use("/students", studentsRoutes);

//authorization
import passport = require("passport");

import { strategy } from "./common/passport/auth.strategy";
passport.use(strategy);

app.use(passport.initialize());
import { authRoute } from "./modules/auth/auth.routes";
app.use("/auth", new authRoute().router);
app.use(errorHandler);
import { authJwt } from "./common/middlewares/auth.middleware";

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
