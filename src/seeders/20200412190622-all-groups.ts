'use strict';

const groupsData = require('../../data/groups');

groupsData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('groups', groupsData);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('groups', null, {});
  },
};
