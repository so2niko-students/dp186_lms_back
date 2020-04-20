import { QueryInterface, DataTypes } from 'sequelize';
import { Comments } from '../modules/comments/comments.model';
import { Solutions } from '../modules/solutions/solutions.model';
import { Students } from '../modules/students/students.model';
import { Teachers } from '../modules/teachers/teachers.model';

export async function up(query: QueryInterface) {
    return query.createTable(Comments.tableName, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        solutionId: {
            type: DataTypes.INTEGER,
            references: {
                model: Solutions.tableName,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        studentId: {
            type: DataTypes.INTEGER,
            references: {
                model: Students.tableName,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        teacherId: {
            type: DataTypes.INTEGER,
            references: {
                model: Teachers.tableName,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        text: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        dateCreate: {
            type: DataTypes.DATE(),
            allowNull: false,
        },
        filesLink: {
            type: DataTypes.STRING(),
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
}

export async function down(query: QueryInterface) {
    return query.dropTable(Comments.tableName);
}
