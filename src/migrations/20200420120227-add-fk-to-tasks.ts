import { QueryInterface, DataTypes } from 'sequelize';
import { Tasks } from '../modules/tasks/tasks.model';
import { Groups } from '../modules/groups/groups.model';

export async function up(query: QueryInterface) {
  return query.changeColumn(Tasks.tableName, 'groupId', {
    type: DataTypes.INTEGER,
    references: {
      model: Groups.tableName,
      key: 'id',
    },
  });
}

export async function down(query: QueryInterface) {
  return query.changeColumn(Tasks.tableName, 'groupId', {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Id of the group',
  });
}

