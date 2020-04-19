"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_http_error_1 = require("./base-http-error");
class BadRequest extends base_http_error_1.BaseHttpError {
    constructor(error) {
        super(400, error);
    }
}
exports.default = BadRequest;
//# sourceMappingURL=bad-request.js.map