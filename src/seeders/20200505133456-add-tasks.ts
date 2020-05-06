import { Tasks } from "../modules/tasks/tasks.model";
import { QueryInterface } from "sequelize";

const tasksData = require("../../data/tasks");

tasksData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

export async function up(query: QueryInterface) {
    return query.bulkInsert(Tasks.tableName, tasksData);
}

export async function down(query: QueryInterface) {
    query.bulkDelete(Tasks.tableName, null, {});
}
