"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
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
            sequelize,
            tableName: this.TableName,
        });
    }
}
exports.Teachers = Teachers;
Teachers.TableName = 'teachers';
Teachers.prepareInit(database_1.sequelize);
//# sourceMappingURL=teachers.model.js.map