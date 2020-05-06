import { File } from "../modules/files/files.model";
import { QueryInterface } from "sequelize";

const fileData = require("../../data/files");

fileData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

export async function up(query: QueryInterface) {
    return query.bulkInsert(File.tableName, fileData);
}

export async function down(query: QueryInterface) {
    query.bulkDelete(File.tableName, null, {});
}
