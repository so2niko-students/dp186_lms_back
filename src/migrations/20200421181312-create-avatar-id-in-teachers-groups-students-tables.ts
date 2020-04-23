import { QueryInterface, DataTypes } from 'sequelize';
import { Avatars } from '../modules/avatars/avatars.model';

export async function up(query: QueryInterface) {
    return query.sequelize.transaction( t => {
      return Promise.all([
        query.addColumn('teachers', 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }, { transaction: t }),
        query.addColumn('groups', 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        }, { transaction: t }),
        query.addColumn('students', 'avatarId', {
          type: DataTypes.INTEGER,
          allowNull: true,
          references:{
            model: Avatars.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
