"use strict";

import * as data from "../data/groups.json";
console.log(data);


// data.forEach((obj) => {
//   obj.createdAt = new Date();
//   obj.updatedAt = new Date();
// });

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert("groups", data);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("groups", null, {});
  },
};