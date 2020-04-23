'use strict';

const studentsData = require('../../data/students');

studentsData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('students', studentsData);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('students', null, {});
  },
};
