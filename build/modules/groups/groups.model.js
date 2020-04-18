"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = require("../../database");
class Groups extends sequelize_1.Model {
    static prepareInit(seq) {
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
        }, { sequelize: database_1.sequelize, tableName: this.TableName });
    }
}
exports.Groups = Groups;
Groups.TableName = 'groups';
Groups.prepareInit(database_1.sequelize);
//# sourceMappingURL=groups.model.js.map