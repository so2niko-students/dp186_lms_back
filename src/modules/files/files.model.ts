import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Tasks } from '../tasks/tasks.model';
import { Comments } from '../comments/comments.model';

export class Files extends Model {
    public static readonly tableName: string = 'files';

    public id: number;
    public commentId: number;
    public taskId: number;
    public fileLink: string;
    public fileNameExtension: string;
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
                    allowNull: false,
                },
                taskId: {
                    type: DataTypes.INTEGER(),
                    allowNull: false,
                },
                fileLink: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                },
                fileNameExtension: {
                    type: DataTypes.STRING(),
                    allowNull: false,
                }
            },
            {
                sequelize,
                tableName: this.tableName,
            }
        );
    }
}

Files.prepareInit(sequelize);

Files.belongsTo(Comments, {
    foreignKey: 'commentId',
    as: 'comment'
});

Comments.hasMany(Files, {
    foreignKey: 'commentId',
    as: 'comment'
});

Files.belongsTo(Tasks, {
    foreignKey: 'taskId',
    // as: 'task'
});

Tasks.hasMany(Files, {
    foreignKey: 'taskId',
    // as: 'task'
});
