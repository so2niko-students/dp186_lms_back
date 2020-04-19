import { Sequelize } from "sequelize";
const dotenv = require("dotenv").config();

export const sequelize: Sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    // @ts-ignore
    dialect: process.env.DB_DIALECT,
    // dialect: "postgres",
    dialectOptions: {
      supportBigNumbers: true,
    },
  }
);

// export const sequelize: Sequelize = new Sequelize("lms", "postgres", "123456", {
//   host: "127.0.0.1",
//   port: +"5432",
//   // @ts-ignore
//   dialect: "postgres",
//   // dialect: "postgres",
//   dialectOptions: {
//     supportBigNumbers: true,
//   },
// });

sequelize
  .authenticate()
  .then(() => console.log("Connection to DataBase is successfully set."))
  .catch((err) => console.log(err));
