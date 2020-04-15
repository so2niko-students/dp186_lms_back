import { QueryInterface, DataTypes } from 'sequelize';
import { Group } from '../modules/groups/group.model';

/**
 * function that sequelize-cli runs if you want to add this migration to your database
 * */
export async function up(query: QueryInterface) {
  try {
    return query.createTable(Group.TableName, {
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
      mentor_id: {
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

/**
 * function that sequelize-cli runs if you want to remove this migration from your database
 * */
export async function down(query: QueryInterface) {
  try {
    return query.dropTable(Group.TableName);
  } catch (e) {
    return Promise.reject(e);
  }
}
