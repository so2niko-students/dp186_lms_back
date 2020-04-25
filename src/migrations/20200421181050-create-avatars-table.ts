import { QueryInterface, DataTypes } from 'sequelize';
import { Avatars } from '../modules/avatars/avatars.model';

export async function up(query: QueryInterface) {
    return query.createTable(Avatars.tableName, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Id of the instance',
      },
      avatarLink: {
        type: DataTypes.STRING(255),
        allowNull: false,
        comment: 'Link to the image',
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
}

export async function down(query: QueryInterface) {
    return query.dropTable(Avatars.tableName);
}
