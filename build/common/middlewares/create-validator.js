"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
const bad_request_1 = __importDefault(require("../exeptions/bad-request"));
exports.createValidator = (schema, key = 'body') => (req, res, next) => {
    const { error } = joi_1.default.validate(req[key], schema);
    if (error) {
        throw new bad_request_1.default(error);
    }
    next();
};
//# sourceMappingURL=create-validator.js.map