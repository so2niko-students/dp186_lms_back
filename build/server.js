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
const groups_routes_1 = require("./modules/groups/groups.routes");
const errors_middleware_1 = __importDefault(require("./common/middlewares/errors.middleware"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
require("./database");
const app = express();
app.use(express.json());
app.use('/api/v1/health', health_routes_1.default);
app.use('/api/v1/groups', groups_routes_1.router);
app.use(errors_middleware_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map