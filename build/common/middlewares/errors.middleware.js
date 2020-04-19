"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = (err, req, res, next) => {
    res.statusCode = err.statusCode;
    res.send(err);
};
//# sourceMappingURL=errors.middleware.js.map