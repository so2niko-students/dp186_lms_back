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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const students_model_1 = __importDefault(require("./students.model"));
const groups_model_1 = __importDefault(require("../groups/groups.model"));
const teachers_model_1 = __importDefault(require("../teachers/teachers.model"));
const groups_service_1 = __importDefault(require("../groups/groups.service"));
const teachers_service_1 = __importDefault(require("../teachers/teachers.service"));
const exeptions_1 = require("../../common/exeptions");
const bcrypt = __importStar(require("bcrypt"));
class StudentsService {
    createOne(studentsData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupId, email, groupToken } = studentsData;
            const isExistTeacherEmail = yield teachers_service_1.default.findOneByEmail(email);
            if (isExistTeacherEmail) {
                throw new exeptions_1.BadRequest("User with provided email already exists");
            }
            const isExistSudentEmail = yield this.findOneByEmail(email);
            if (isExistSudentEmail) {
                throw new exeptions_1.BadRequest("User with provided email already exists");
            }
            const group = yield groups_service_1.default.findOneById(groupId);
            if (!group) {
                throw new exeptions_1.NotFound("Group not found");
            }
            if (group.groupToken !== groupToken) {
                throw new exeptions_1.BadRequest("Not walid group token");
            }
            const students = new students_model_1.default(studentsData);
            students.password = yield bcrypt.hash(students.password, 10);
            return yield students.save();
        });
    }
    findOneByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield students_model_1.default.findOne({
                where: { email },
            });
            return student;
        });
    }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const student = yield students_model_1.default.findOne({ where: { id } });
            return student;
        });
    }
    findMany() {
        return __awaiter(this, void 0, void 0, function* () {
            const students = teachers_model_1.default.findAll({
                include: [{ model: groups_model_1.default, include: [{ model: students_model_1.default }] }],
            });
            if (!students) {
                throw new exeptions_1.NotFound("Students not found");
            }
            return students;
        });
    }
}
exports.default = new StudentsService();
//# sourceMappingURL=students.service.js.map