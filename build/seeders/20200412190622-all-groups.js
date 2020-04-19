"use strict";
// import data from "../data/groups.json";
const groupsData = require("../../data/groups");
groupsData.forEach((obj) => {
    obj.createdAt = new Date();
    obj.updatedAt = new Date();
});
module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert("groups", groupsData);
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete("groups", null, {});
    },
};
//# sourceMappingURL=20200412190622-all-groups.js.map