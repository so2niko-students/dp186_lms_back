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
const sequelize_1 = require("sequelize");
const teachers_model_1 = __importDefault(require("../modules/teachers/teachers.model"));
function up(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return query.createTable(teachers_model_1.default.TableName, {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
                comment: "Id of the instance",
            },
            firstName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                comment: "First name of the teacher",
            },
            lastName: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                comment: "Last name of the teacher",
            },
            email: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: false,
                unique: true,
                comment: "Email of the teacher",
            },
            password: {
                type: sequelize_1.DataTypes.STRING(10),
                allowNull: false,
                comment: "Password of the teacher",
            },
            isAdmin: {
                type: sequelize_1.DataTypes.BOOLEAN,
                allowNull: false,
                comment: "Is teacher an admin?",
            },
            createdAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                comment: "Date of creation",
            },
            updatedAt: {
                type: sequelize_1.DataTypes.DATE,
                allowNull: false,
                comment: "Date of the last update",
            },
            deletedAt: sequelize_1.DataTypes.DATE,
        });
    });
}
exports.up = up;
function down(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return query.dropTable(teachers_model_1.default.TableName);
    });
}
exports.down = down;
//# sourceMappingURL=20200415143335-create-table-of-teachers.js.map