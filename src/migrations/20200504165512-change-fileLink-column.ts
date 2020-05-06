import { QueryInterface } from 'sequelize';
import { File } from '../modules/files/files.model';

export async function up(query: QueryInterface) {
  return query.renameColumn(File.tableName, 'fileLink', 'fileContent');
}

export async function down(query: QueryInterface) {
  return query.renameColumn(File.tableName, 'fileContent', 'fileLink');
}
