"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = __importStar(require("body-parser"));
const health_routes_1 = __importDefault(require("./modules/health/health.routes"));
const groups_routes_1 = require("./modules/groups/groups.routes");
const errors_middleware_1 = require("./common/middlewares/errors.middleware");
const auth_middleware_1 = require("./common/middlewares/auth.middleware");
const passport = require("passport");
const auth_strategy_1 = require("./common/passport/auth.strategy");
const auth_routes_1 = require("./modules/auth/auth.routes");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
require("./database");
const app = express();
app.use(express.json());
app.use(bodyParser.json());
app.use('/api/v1/health', health_routes_1.default);
app.use('/groups', auth_middleware_1.authJwt, groups_routes_1.router);
app.use(errors_middleware_1.errorHandler);
// authorization
passport.use(auth_strategy_1.strategy);
app.use(passport.initialize());
app.use('/auth', new auth_routes_1.authRoute().router);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running in http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map