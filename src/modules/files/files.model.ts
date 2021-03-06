import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Tasks } from '../tasks/tasks.model';
import { Comment } from '../comments/comments.model';

export class File extends Model {
    public static readonly tableName: string = 'files';

    public id: number;
    public commentId!: number;
    public taskId!: number;
    public fileLink: string;
    public fileNameExtension: string;
    public removeId: string;
    public createdAt: Date;
    public updatedAt: Date;

    public static prepareInit(sequelize: Sequelize) {
        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                commentId: {
                    type: DataTypes.INTEGER(),
                    allowNull: true,
                },
                taskId: {
                    type: DataTypes.INTEGER(),
                    allowNull: true,
                },
                fileLink: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                },
                fileNameExtension: {
                    type: DataTypes.STRING(),
                    allowNull: true,
                },
                removeId: {
                  type: DataTypes.STRING(100),
                  allowNull: false,
                },
            },
            {
                sequelize,
                tableName: this.tableName,
            }
        );
    }
}

File.prepareInit(sequelize);

File.belongsTo(Comment, {
    foreignKey: 'commentId',
    as: 'comment'
});

Comment.hasMany(File, {
    foreignKey: 'commentId',
    as: 'files',
    onDelete: 'cascade'
});

File.belongsTo(Tasks, {
    foreignKey: 'taskId',
    as: 'task'
});

Tasks.hasMany(File, {
    foreignKey: 'taskId',
    as: 'files', 
    onDelete: 'cascade'
});
