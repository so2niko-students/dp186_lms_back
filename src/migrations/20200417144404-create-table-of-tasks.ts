import { QueryInterface, DataTypes } from 'sequelize';
import { Tasks } from '../modules/tasks/tasks.model';

export async function up(query: QueryInterface) {
    return query.createTable(Tasks.TableName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Id of the instance',
      },
      groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        comment: 'Id of the group',
      },
      taskName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Name of the task',
      },
      fileURL: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'URL of the task',
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of creation',
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: 'Date of the last update',
      },
    });
}

export async function down(query: QueryInterface) {
    return query.dropTable(Tasks.TableName);
}
