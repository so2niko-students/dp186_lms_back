"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const students_routes_1 = __importDefault(require("./modules/students/students.routes"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
require("./database");
const error_handler_1 = require("./common/middlewares/error-handler");
const app = express();
app.use(express.json());
app.use("/api/v1/health", health_routes_1.default);
app.use("/students", students_routes_1.default);
app.use(error_handler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map