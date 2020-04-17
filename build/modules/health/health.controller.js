"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
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