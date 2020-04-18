"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const groups_controller_1 = __importDefault(require("./groups.controller"));
const create_validator_1 = require("../../common/middlewares/create-validator");
const groups_dtos_1 = require("./groups.dtos");
exports.router = new express_1.Router();
exports.router.get('/', groups_controller_1.default.findMany);
exports.router.get('/:id', groups_controller_1.default.findOne);
exports.router.post('/', create_validator_1.createValidator(groups_dtos_1.createGroupDto), groups_controller_1.default.createOne);
exports.router.post('/:id', create_validator_1.createValidator(groups_dtos_1.updateGroupDto), groups_controller_1.default.updateOne);
exports.router.delete('/:id', groups_controller_1.default.deleteOne);
//# sourceMappingURL=groups.routes.js.map