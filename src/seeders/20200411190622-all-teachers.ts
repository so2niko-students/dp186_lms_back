"use strict";

// import data from "../data/teachers.json";

const teachersData = require("../../data/teachers");

// interface dataConfig {
//   firstName: string;
//   lastName: string;
//   email: string;
//   password: string;
//   isAdmin: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

teachersData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("teachers", teachersData);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("teachers", null, {});
  },
};
