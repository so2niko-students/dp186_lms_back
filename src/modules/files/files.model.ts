import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Tasks } from '../tasks/tasks.model';
import { Comment } from '../comments/comments.model';
//Подключение cloudinary
var cloudinary = require("cloudinary").v2;
cloudinary.config({cloud_name: "dumh8jxl6",
    api_key: "184624831118258",
    api_secret: "p06ZSpuMItwjKhmPoFVPTxcK1S4"
});

export class File extends Model {
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
                    allowNull: true,
                }
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
    onDelete: 'cascade'
});

File.belongsTo(Tasks, {
    foreignKey: 'taskId',
    as: 'task'
});

Tasks.hasMany(File, {
    foreignKey: 'taskId',
    onDelete: 'cascade'
});
