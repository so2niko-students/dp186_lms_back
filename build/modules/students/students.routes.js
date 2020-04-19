"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const students_dtos_1 = require("./students.dtos");
const express_1 = require("express");
const students_controller_1 = __importDefault(require("./students.controller"));
const create_validator_1 = require("../../common/middlewares/create-validator");
const router = new express_1.Router();
router.post("/", create_validator_1.createValidator(students_dtos_1.CreateStudentsDto), students_controller_1.default.createOne);
exports.default = router;
//# sourceMappingURL=students.routes.js.map