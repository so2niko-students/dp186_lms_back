"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const joi_1 = __importDefault(require("joi"));
exports.createGroupDto = joi_1.default.object().keys({
    groupName: joi_1.default.string().min(2).required(),
    teacherId: joi_1.default.number().required(),
});
exports.updateGroupDto = joi_1.default.object().keys({
    id: joi_1.default.number(),
    groupName: joi_1.default.string().min(2),
    groupToken: joi_1.default.string().min(5),
    teacherId: joi_1.default.number(),
});
//# sourceMappingURL=groups.dtos.js.map