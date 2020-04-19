"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
    res.statusCode = err.statusCode;
    res.send(err);
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error-handler.js.map