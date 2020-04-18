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
const groups_model_1 = require("./groups.model");
const exeptions_1 = require("../../common/exeptions/");
const bcrypt_1 = require("bcrypt");
const bad_request_1 = __importDefault(require("../../common/exeptions/bad-request"));
class GroupsService {
    createOne(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { groupName } = data;
            const group = yield groups_model_1.Groups.findAll({ where: { groupName } });
            if (group.length === 0) {
                const salt = bcrypt_1.genSaltSync(5, 'b');
                const hash = bcrypt_1.hashSync(data.groupName, salt);
                data.groupToken = hash.replace(/\//g, 'slash');
                return groups_model_1.Groups.create(Object.assign({}, data));
            }
            throw new bad_request_1.default(`Group with name "${groupName} already exist`);
        });
    }
    findOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return groups_model_1.Groups.findOne({ where: { id } });
        });
    }
    updateOne(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield groups_model_1.Groups.findOne({ where: { id } });
            if (group) {
                Object.keys(data).forEach((k) => group[k] = data[k]);
                group.save();
                return group;
            }
            throw new exeptions_1.NotFound(`Group with ${id} not found.`);
        });
    }
    deleteOne(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const group = yield groups_model_1.Groups.findOne({ where: { id } });
            if (group) {
                group.destroy();
                return group;
            }
            throw new exeptions_1.NotFound(`Group with ${id} not found.`);
        });
    }
    findMany() {
        return __awaiter(this, void 0, void 0, function* () {
            return groups_model_1.Groups.findAll();
        });
    }
}
const groupsService = new GroupsService();
exports.default = groupsService;
//# sourceMappingURL=groups.service.js.map