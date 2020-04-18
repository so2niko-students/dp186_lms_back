"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseHttpError {
    constructor(statusCode, error) {
        this.statusCode = statusCode;
        this.error = error;
        console.exception(`${this.statusCode}: ${this.error}`);
    }
}
exports.BaseHttpError = BaseHttpError;
//# sourceMappingURL=base-http-error.js.map