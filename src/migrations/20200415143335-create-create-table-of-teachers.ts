import { QueryInterface, DataTypes } from 'sequelize';
import { Teachers } from '../models/create_table_of_teachers';

export async function up(query: QueryInterface) {
  try {
    return query.createTable(Teachers.TableName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Id of the instance',
      },
      firstName: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        comment: 'First name of the teacher',
      },
      lastName: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        comment: 'Last name of the teacher',
      },
      email: {
        type: new DataTypes.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Email of the teacher',
      },
      password: {
        type: new DataTypes.STRING(10),
        allowNull: false,
        comment: 'Password of the teacher',
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        comment: 'Is teacher an admin?',
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
      deletedAt: DataTypes.DATE,
    });
  } catch (e) {
    return Promise.reject(e);
  }
}

export async function down(query: QueryInterface) {
  try {
    return query.dropTable(Teachers.TableName);
  } catch (e) {
    return Promise.reject(e);
  }
}