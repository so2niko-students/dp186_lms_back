"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const students_service_1 = __importDefault(require("./students.service"));
class StudentsController {
    createOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const student = yield students_service_1.default.createOne(req.body);
                res.json(student);
            }
            catch (e) {
                next(e);
            }
        });
    }
    findMany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield students_service_1.default.findMany();
                res.json(data);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
const studentsController = new StudentsController();
exports.default = studentsController;
//# sourceMappingURL=students.controller.js.map