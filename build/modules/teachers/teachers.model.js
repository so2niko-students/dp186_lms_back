"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
class Teachers extends sequelize_1.Model {
    static prepareInit(sequelize) {
        this.init({
            id: {
                type: sequelize_1.DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            firstName: sequelize_1.DataTypes.STRING(255),
            lastName: sequelize_1.DataTypes.STRING(255),
            email: sequelize_1.DataTypes.STRING(255),
            password: sequelize_1.DataTypes.STRING(10),
            isAdmin: sequelize_1.DataTypes.BOOLEAN,
        }, {
            sequelize: sequelize,
            tableName: this.TableName,
        });
    }
}
exports.Teachers = Teachers;
Teachers.ModelName = 'teacher';
Teachers.TableName = 'teachers';
//# sourceMappingURL=teachers.model.js.map