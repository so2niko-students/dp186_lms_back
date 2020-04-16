import { QueryInterface, DataTypes } from 'sequelize';
import { Groups } from '../modules/groups/groups.model';

export async function up(query: QueryInterface) {
  try {
    return query.createTable(Groups.TableName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      group_name: {
        type: new DataTypes.STRING(),
        allowNull: false,
      },
      group_token: {
        type: new DataTypes.STRING(255),
        allowNull: true,
      },
      teacher_id: {
        type: new DataTypes.INTEGER(),
        allowNull: true,
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
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function down(query: QueryInterface) {
  try {
    return query.dropTable(Groups.TableName);
  } catch (e) {
    return Promise.reject(e);
  }
}
