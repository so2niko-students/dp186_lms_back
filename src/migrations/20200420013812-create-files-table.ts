import { QueryInterface, DataTypes } from 'sequelize';
import { File } from '../modules/files/files.model';
import { Comment } from '../modules/comments/comments.model';
import { Tasks } from '../modules/tasks/tasks.model';

export async function up(query: QueryInterface) {
    return query.createTable(File.tableName, {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        commentId: {
            type: DataTypes.INTEGER,
            references: {
                model: Comment.tableName,
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
        fileLink: {
            type: DataTypes.STRING(),
            allowNull: false,
        },
        fileNameExtension: {
            type: DataTypes.STRING(),
            allowNull: false,
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
    return query.dropTable(File.tableName);
}
