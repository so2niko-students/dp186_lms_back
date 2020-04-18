"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const base_http_error_1 = require("./base-http-error");
class NotFound extends base_http_error_1.BaseHttpError {
    constructor(error) {
        super(http_status_codes_1.NOT_FOUND, error);
    }
}
exports.default = NotFound;
//# sourceMappingURL=not-found.js.map