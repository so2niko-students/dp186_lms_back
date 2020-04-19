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
const students_model_1 = __importDefault(require("../modules/students/students.model"));
function up(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return query.createTable(students_model_1.default.TableName, {
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            firstNameUkr: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            lastNameUkr: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            firstNameEng: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            lastNameEng: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            email: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            phoneNumber: {
                type: sequelize_1.DataTypes.DOUBLE(),
                allowNull: false,
            },
            password: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            groupId: {
                type: sequelize_1.DataTypes.INTEGER(),
                allowNull: false,
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
        });
    });
}
exports.up = up;
function down(query) {
    return __awaiter(this, void 0, void 0, function* () {
        return query.dropTable(students_model_1.default.TableName);
    });
}
exports.down = down;
//# sourceMappingURL=20200415231700-create-students-table.js.map