"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_http_error_1 = require("./base-http-error");
class NotFound extends base_http_error_1.BaseHttpError {
    constructor(error) {
        super(404, error);
    }
}
exports.default = NotFound;
//# sourceMappingURL=not-found.js.map