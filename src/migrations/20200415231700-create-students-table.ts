import { QueryInterface, DataTypes } from 'sequelize';
import { Students } from '../modules/students/students.model';
import { Groups } from '../modules/groups/groups.model';

export async function up(query: QueryInterface) {
    return query.createTable(Students.tableName, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        firstNameUkr: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        lastNameUkr: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        firstNameEng: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        lastNameEng: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        phoneNumber: {
            type: DataTypes.DOUBLE(),
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        groupId: {
          type: DataTypes.INTEGER,
          references: {
            model: Groups.tableName,
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
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
    return query.dropTable(Students.tableName);
}
