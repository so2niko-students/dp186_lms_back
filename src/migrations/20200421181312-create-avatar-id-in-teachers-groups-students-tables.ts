import { QueryInterface, DataTypes } from 'sequelize';
import { Avatars } from '../modules/avatars/avatars.model';
import { Teachers } from '../modules/teachers/teachers.model'
import { Students } from '../modules/students/students.model'
import { Groups } from '../modules/groups/groups.model'

export async function up(query: QueryInterface) {
    return query.sequelize.transaction( t => {
      return Promise.all([
        query.addColumn(Teachers.tableName, 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, { transaction: t }),
        query.addColumn(Groups.tableName, 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, { transaction: t }),
        query.addColumn(Students.tableName, 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        }, { transaction: t })
      ]);
    });
}

export async function down(query: QueryInterface) {
  return query.sequelize.transaction( t => {
    return Promise.all([
      query.removeColumn('teachers', 'avatarId', { transaction: t }),
      query.removeColumn('groups', 'avatarId', { transaction: t }),
      query.removeColumn('students', 'avatarId', { transaction: t })
    ]);
  });
}
