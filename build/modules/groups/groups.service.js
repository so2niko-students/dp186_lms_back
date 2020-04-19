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
Object.defineProperty(exports, "__esModule", { value: true });
const groups_model_1 = require("./groups.model");
const teachers_model_1 = require("../teachers/teachers.model");
const students_model_1 = require("../students/students.model");
const exeptions_1 = require("../../common/exeptions/");
const bcrypt_1 = require("bcrypt");
class GroupsService {
    createOne(data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mentorVerification(user);
            const { groupName } = data;
            const group = yield groups_model_1.Groups.findAll({ where: { groupName } });
            if (group.length === 0) {
                data.groupToken = yield this.createGroupToken(groupName);
                return groups_model_1.Groups.create(Object.assign({}, data));
            }
            throw new exeptions_1.BadRequest(`Group with name "${groupName} already exist`);
        });
    }
    findOne(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = user;
            const mentor = yield teachers_model_1.Teachers.findOne({ where: { id: user.id, email, password } });
            if (!mentor) {
                const student = yield students_model_1.Students.findOne({ where: { id: user.id, email, password } });
                if (student) {
                    if (student.groupId === id) {
                        return groups_model_1.Groups.findOne({ where: { id } });
                    }
                    throw new exeptions_1.Unauthorized('You do not have rights to do this.');
                }
                throw new exeptions_1.Unauthorized('You do not have rights to do this.');
            }
            return groups_model_1.Groups.findOne({ where: { id } });
        });
    }
    updateOne(id, data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentor = yield this.mentorVerification(user);
            const group = yield groups_model_1.Groups.findOne({ where: { id } });
            if (group) {
                if (group.teacherId === mentor.id) {
                    Object.keys(data).forEach((k) => group[k] = data[k]);
                    group.save();
                    return group;
                }
                throw new exeptions_1.Unauthorized('You do not have rights to do this.');
            }
            throw new exeptions_1.NotFound(`Group with ${id} not found.`);
        });
    }
    deleteOne(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const mentor = yield this.mentorVerification(user);
            const group = yield groups_model_1.Groups.findOne({ where: { id } });
            if (group) {
                if (group.teacherId === mentor.id) {
                    group.destroy();
                    return group;
                }
                throw new exeptions_1.Unauthorized('You do not have rights to do this.');
            }
            throw new exeptions_1.NotFound(`Group with ${id} not found.`);
        });
    }
    findMany(user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.mentorVerification(user);
            return groups_model_1.Groups.findAll();
        });
    }
    createGroupToken(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = bcrypt_1.genSaltSync(5, 'b');
            const hash = bcrypt_1.hashSync(name, salt);
            return hash.replace(/\//g, 'slash');
        });
    }
    mentorVerification(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id, email, password } = user;
            // Check user in Teachers table
            const mentor = yield teachers_model_1.Teachers.findOne({ where: { id, email, password } });
            if (mentor) {
                return mentor;
            }
            throw new exeptions_1.Unauthorized('You do not have rights to do this.');
        });
    }
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups.service.js.map