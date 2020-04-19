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
const groups_service_1 = __importDefault(require("./groups.service"));
class GroupsController {
    createOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield groups_service_1.default.createOne(req.body, req.user);
                res.send(group);
            }
            catch (e) {
                next(e);
            }
        });
    }
    findOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield groups_service_1.default.findOne(Number(req.params.id), req.user);
                res.send(group);
            }
            catch (e) {
                next(e);
            }
        });
    }
    updateOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield groups_service_1.default.updateOne(Number(req.params.id), req.body, req.user);
                res.send(group);
            }
            catch (e) {
                next(e);
            }
        });
    }
    deleteOne(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield groups_service_1.default.deleteOne(Number(req.params.id), req.user);
                res.send(group);
            }
            catch (e) {
                next(e);
            }
        });
    }
    findMany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const groups = yield groups_service_1.default.findMany(req.user);
                res.send(groups);
            }
            catch (e) {
                next(e);
            }
        });
    }
}
const groupsController = new GroupsController();
exports.default = groupsController;
//# sourceMappingURL=groups.controller.js.map