"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
const teachers_model_1 = require("../teachers/teachers.model");
class Groups extends sequelize_1.Model {
    static prepareInit(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            groupName: {
                type: sequelize_1.DataTypes.STRING(),
                allowNull: false,
            },
            groupToken: {
                type: sequelize_1.DataTypes.STRING(255),
                allowNull: true,
            },
            teacherId: {
                type: sequelize_1.DataTypes.INTEGER(),
                allowNull: true,
            },
        }, {
            sequelize,
            tableName: this.TableName,
        });
    }
}
exports.Groups = Groups;
Groups.TableName = "groups";
Groups.prepareInit(database_1.sequelize);
Groups.belongsTo(teachers_model_1.Teachers, {
    foreignKey: "teacherId",
    as: "teachers",
});
teachers_model_1.Teachers.hasMany(Groups, {
    foreignKey: "teacherId",
    as: "teachers",
});
//# sourceMappingURL=groups.model.js.map