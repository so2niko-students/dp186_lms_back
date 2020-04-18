"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const publicController = __importStar(require("./health.controller"));
const router = express.Router();
router.get("/", publicController.getHealth);
exports.default = router;
//# sourceMappingURL=health.routes.js.map