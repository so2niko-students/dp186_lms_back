"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const students_dtos_1 = require("./students.dtos");
const express_1 = require("express");
const students_controller_1 = require("./students.controller");
const create_validator_1 = require("../../common/middlewares/create-validator");
exports.router = express_1.Router();
exports.router.post("/", create_validator_1.createValidator(students_dtos_1.CreateStudentsDto), students_controller_1.studentsController.createOne);
//# sourceMappingURL=students.routes.js.map