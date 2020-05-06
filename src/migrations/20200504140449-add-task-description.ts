import { QueryInterface, DataTypes } from "sequelize";
import { Tasks } from "../modules/tasks/tasks.model";

export async function up(query: QueryInterface) {
  return query.addColumn(Tasks.tableName, "description", {
    type: DataTypes.TEXT,
    allowNull: true,
  });
}

export async function down(query: QueryInterface) {
  return query.removeColumn(Tasks.tableName, "description");
}
