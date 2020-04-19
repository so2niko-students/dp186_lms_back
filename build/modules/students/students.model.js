"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
class Students extends sequelize_1.Model {
    // region Static
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
            sequelize: sequelize,
            tableName: this.TableName,
        });
    }
}
Students.TableName = "students";
Students.prepareInit(database_1.sequelize);
// class Students extends Model {}
// const StudentsModel = Students.init(
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       allowNull: false,
//       autoIncrement: true,
//     },
//     firstNameUkr: DataTypes.STRING(),
//     lastNameUkr: DataTypes.STRING(),
//     firstNameEng: DataTypes.STRING(),
//     lastNameEng: DataTypes.STRING(),
//     email: DataTypes.STRING(),
//     phoneNumber: DataTypes.STRING(),
//     password: DataTypes.STRING(),
//     groupId: DataTypes.INTEGER(),
//   },
//   {
//     sequelize,
//   }
// );
exports.default = Students;
//# sourceMappingURL=students.model.js.map