import { Comment } from "../modules/comments/comments.model";
import { QueryInterface } from "sequelize";

const commentData = require("../../data/comments");

commentData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

export async function up(query: QueryInterface) {
    return query.bulkInsert(Comment.tableName, commentData);
}

export async function down(query: QueryInterface) {
    query.bulkDelete(Comment.tableName, null, {});
}
