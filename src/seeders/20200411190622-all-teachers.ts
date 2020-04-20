"use strict";

const teachersData = require("../../data/teachers");

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
