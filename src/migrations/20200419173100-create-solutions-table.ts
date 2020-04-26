import { QueryInterface, DataTypes } from 'sequelize';
import { Solution } from '../modules/solutions/solutions.model';
import { Students } from '../modules/students/students.model';
import { Tasks } from '../modules/tasks/tasks.model';

export async function up(query: QueryInterface) {
    return query.createTable(Solution.tableName, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
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
        taskId: {
            type: DataTypes.INTEGER,
            references: {
                model: Tasks.tableName,
                key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        grade: {
            type: DataTypes.INTEGER(),
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
    return query.dropTable(Solution.tableName);
}
