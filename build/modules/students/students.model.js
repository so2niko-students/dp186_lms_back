"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
const groups_model_1 = require("../groups/groups.model");
class Students extends sequelize_1.Model {
    static prepareInit(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false,
                autoIncrement: true,
            },
            firstNameUkr: sequelize_1.DataTypes.STRING(),
            lastNameUkr: sequelize_1.DataTypes.STRING(),
            firstNameEng: sequelize_1.DataTypes.STRING(),
            lastNameEng: sequelize_1.DataTypes.STRING(),
            email: sequelize_1.DataTypes.STRING(),
            phoneNumber: sequelize_1.DataTypes.STRING(),
            password: sequelize_1.DataTypes.STRING(),
            groupId: sequelize_1.DataTypes.INTEGER(),
        }, {
            sequelize,
            tableName: this.TableName,
        });
    }
}
exports.Students = Students;
Students.TableName = "students";
Students.prepareInit(database_1.sequelize);
Students.belongsTo(groups_model_1.Groups, {
    foreignKey: "groupId",
    as: "group",
});
groups_model_1.Groups.hasMany(Students, {
    foreignKey: "groupId",
    as: "group",
});
//# sourceMappingURL=students.model.js.map