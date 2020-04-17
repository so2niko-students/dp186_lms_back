"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const health_routes_1 = require("./modules/health/health.routes");
const dotenv = require("dotenv");
dotenv.config();
require("./database");
const app = express();
app.use(express.json());
app.use('/api/v1/health', health_routes_1.default);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map