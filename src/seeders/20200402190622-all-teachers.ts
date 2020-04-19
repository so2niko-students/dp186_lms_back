"use strict";

import * as data from "../data/teachers.json";

//const data: Array<object> = require('../data/teachers.json');

// data.forEach((obj) => {
//   obj.createdAt = new Date();
//   obj.updatedAt = new Date();
// });

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("teachers", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("teachers", null, {});
  },
};