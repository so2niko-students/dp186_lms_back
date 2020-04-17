"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    // @ts-ignore
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        supportBigNumbers: true
    }
});
exports.sequelize
    .authenticate()
    .then(() => console.log('Connection to DataBase is successfully set.'))
    .catch(err => console.log(err));
//# sourceMappingURL=database.js.map