import { Sequelize } from 'sequelize';
import dotenv = require('dotenv');
dotenv.config();

export const sequelize: Sequelize = new Sequelize(process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS, {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    // @ts-ignore
    dialect: process.env.DB_DIALECT,
    dialectOptions: {
        supportBigNumbers: true,
    },
});

sequelize
    .authenticate()
    .then(() => console.log('Connection to DataBase is successfully set on port ' + process.env.DB_PORT))
    .catch(err => console.log(err));
