import express = require("express");
import { default as healthRoutes } from "./modules/health/health.routes";
import { router as studentsRoutes } from "./modules/students/students.routes";
import { router as tasksRoutes} from "./modules/tasks/tasks.routes";
import * as dotenv from "dotenv";
dotenv.config();
import "./database";
import { errorHandler } from "./common/middlewares/errors.middleware";

const app: express.Express = express();
app.use(express.json());



//authorization
import passport = require("passport");

import { strategy } from "./common/passport/auth.strategy";
passport.use(strategy);

app.use(passport.initialize());
import { authRoute } from "./modules/auth/auth.routes";
app.use("/auth", new authRoute().router);
app.use(errorHandler);
import { authJwt } from "./common/middlewares/auth.middleware";

app.use("/api/v1/health", healthRoutes);
app.use("/students", studentsRoutes);
app.use("/tasks", authJwt, tasksRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running in http://localhost:${PORT}`);
});
// import express = require("express");
// // //REMOVE
// // import * as bodyParser from 'body-parser';
// // //REMOVE
// import { default as healthRoutes } from "./modules/health/health.routes";
// import { router as studentsRoutes } from "./modules/students/students.routes";
// //REMOVE
// import { router as tasksRoutes } from "./modules/tasks/tasks.routes";
// //REMOVE
// import * as dotenv from "dotenv";
// dotenv.config();
// import "./database";
// import { errorHandler } from "./common/middlewares/errors.middleware";

// const app: express.Express = express();
// app.use(express.json());
// // //REMOVE
// // app.use(bodyParser.json());
// // //REMOVE

// app.use("/api/v1/health", healthRoutes);
// app.use("/students", studentsRoutes);

// //authorization
// import passport = require("passport");

// import { strategy } from "./common/passport/auth.strategy";
// passport.use(strategy);

// app.use(passport.initialize());
// import { authRoute } from "./modules/auth/auth.routes";
// app.use("/auth", new authRoute().router);
// app.use(errorHandler);
// import { authJwt } from "./common/middlewares/auth.middleware";
// //REMOVE
// app.use('/tasks', authJwt, tasksRoutes);
// //REMOVE
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running in http://localhost:${PORT}`);
// });
