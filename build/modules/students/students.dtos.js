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
exports.CreateStudentsDto = Joi.object().keys({
    firstNameUkr: Joi.string().min(1).required(),
    lastNameUkr: Joi.string().min(1).required(),
    firstNameEng: Joi.string().min(1).required(),
    lastNameEng: Joi.string().min(1).required(),
    password: Joi.string().min(6).required(),
    passwordConfirmation: Joi.any().valid(Joi.ref("password")).required(),
    email: Joi.string().email().required(),
    phoneNumber: Joi.number().integer().required(),
    groupId: Joi.number().integer().required(),
    groupToken: Joi.string().min(1).required(),
});
//# sourceMappingURL=students.dtos.js.map