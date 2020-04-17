"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const publicController = require("./health.controller");
const router = express.Router();
router.get("/", publicController.getHealth);
exports.default = router;
//# sourceMappingURL=health.routes.js.map