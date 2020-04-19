"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const bad_request_1 = __importDefault(require("../exeptions/bad-request"));
exports.createValidator = (schema, key = 'body') => (req, res, next) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
        throw new bad_request_1.default(error);
    }
    next();
};
//# sourceMappingURL=create-validator.js.map