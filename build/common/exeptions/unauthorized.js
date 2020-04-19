"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const base_http_error_1 = require("./base-http-error");
class Unauthorized extends base_http_error_1.BaseHttpError {
    constructor(error) {
        super(403, error);
    }
}
exports.default = Unauthorized;
//# sourceMappingURL=unauthorized.js.map