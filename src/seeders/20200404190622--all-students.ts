"use strict";

import * as data from "../data/students.json";

// data.forEach((obj) => {
//   obj.createdAt = new Date();
//   obj.updatedAt = new Date();
// });

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("students", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("students", null, {});
  },
};