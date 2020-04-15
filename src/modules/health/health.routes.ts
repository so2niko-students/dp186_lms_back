import * as express from "express";
import * as publicController from "./health.controller";
const router = express.Router();

router.get("/", publicController.getHealth);

export default router;
