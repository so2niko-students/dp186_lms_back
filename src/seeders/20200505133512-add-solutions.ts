import { Solution } from '../modules/solutions/solutions.model';
import { QueryInterface } from 'sequelize';

const solutionData = require('../../data/solutions');

solutionData.forEach((obj) => {
  obj.createdAt = new Date();
  obj.updatedAt = new Date();
});

export async function up(query: QueryInterface) {
  return query.bulkInsert(Solution.tableName, solutionData);
}

export async function down(query: QueryInterface) {
  query.bulkDelete(Solution.tableName, null, {});
}
