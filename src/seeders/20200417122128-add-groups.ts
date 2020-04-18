import { QueryInterface, Sequelize } from 'sequelize';
import { Groups } from '../modules/groups/groups.model';

export async function up(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkInsert(Groups.tableName, [
    {
      groupName: 'NODE.JS',
      groupToken: '1293cy2984y1-04ukl21934-u120v893412',
      teacherId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      groupName: 'WEB UI',
      groupToken: 'paoi8u4-8q05v7m-w308a57m-a83057aw08',
      teacherId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkDelete(Groups.tableName, null, {});
}
