import { QueryInterface, DataTypes } from "sequelize";
import { Tasks } from "../modules/tasks/tasks.model";

export async function up(query: QueryInterface) {
  return query.removeColumn(Tasks.tableName, "fileURL");
}

export async function down(query: QueryInterface) {
    return query.addColumn(Tasks.tableName, "fileURL", {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: "URL of the task",
    });
}

