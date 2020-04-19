"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __importStar(require("joi"));
const createValidator = (schema, key = "body") => (req, res, next) => {
    const { error } = Joi.validate(req[key], schema);
    if (error) {
        return res.send(error);
    }
    next();
};
exports.createValidator = createValidator;
//# sourceMappingURL=create-validator.js.map