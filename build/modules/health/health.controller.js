"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = __importStar(require("http-status-codes"));
exports.getHealth = (req, res, next) => {
    const somethingWrong = false;
    if (somethingWrong) {
        res.status(HttpStatus.SERVICE_UNAVAILABLE);
        return res.json({
            status: "UNAVAILABLE"
        });
    }
    res.status(HttpStatus.OK);
    res.json({
        status: "OK"
    });
};
//# sourceMappingURL=health.controller.js.map