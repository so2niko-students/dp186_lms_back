import { QueryInterface, DataTypes } from 'sequelize';
import { Teachers } from '../modules/teachers/teachers.model';

export async function up(query: QueryInterface) {
  return query.changeColumn(Teachers.tableName, 'password', {
    type: DataTypes.STRING(),
    allowNull: false,
    comment: 'Password of the teacher',
  });
}

export async function down(query: QueryInterface) {
  return query.changeColumn(Teachers.tableName, 'password', {
    type: DataTypes.STRING(10),
    allowNull: false,
    comment: 'Password of the teacher',
  });
}
