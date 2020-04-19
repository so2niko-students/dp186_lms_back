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
exports.createGroupDto = Joi.object().keys({
    groupName: Joi.string().min(2).required(),
    teacherId: Joi.number().required(),
});
exports.updateGroupDto = Joi.object().keys({
    id: Joi.number(),
    groupName: Joi.string().min(2),
    groupToken: Joi.string().min(5),
    teacherId: Joi.number(),
});
//# sourceMappingURL=groups.dtos.js.map