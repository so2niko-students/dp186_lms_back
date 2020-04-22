import { QueryInterface, DataTypes } from "sequelize";
import { Groups } from "../modules/groups/groups.model";
import { Teachers } from "../modules/teachers/teachers.model";

export async function up(query: QueryInterface) {
  return query.createTable(Groups.tableName, {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    groupName: {
      type: DataTypes.STRING(),
      allowNull: false,
    },
    groupToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    teacherId: {
      type: DataTypes.INTEGER,
      references: {
        model: Teachers.tableName,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "SET NULL",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date of creation",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "Date of the last update",
    },
  });
}

export async function down(query: QueryInterface) {
  return query.dropTable(Groups.tableName);
}
