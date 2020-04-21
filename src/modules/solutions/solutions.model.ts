import { DataTypes, Model, Sequelize } from 'sequelize';
import {sequelize} from '../../database';
import {Tasks} from '../tasks/tasks.model';
import {Students} from '../students/students.model';

export class Solutions extends Model {
    public static readonly tableName: string = 'solutions';

    public id!: number;
    public studentId: number;
    public taskId: number;
    public solutionLink: string;
    public grade: number;
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
                studentId: {
                    type: DataTypes.INTEGER(),
                    allowNull: false,
                },
                taskId: {
                    type: DataTypes.INTEGER(),
                    allowNull: false,
                },
                solutionLink: {
                    type: DataTypes.STRING(),
                    allowNull: true,
                },
                grade: {
                    type: DataTypes.NUMBER(),
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: this.tableName,
            }
        );
    }
}

Solutions.prepareInit(sequelize);

Solutions.belongsTo(Tasks, {
    foreignKey: 'taskId',
    as: 'task'
});

Tasks.hasMany(Solutions, {
    foreignKey: 'taskId',
    as: 'task'
});

Solutions.belongsTo(Students, {
    foreignKey: 'studentId',
    as: 'student'
});

Students.hasOne(Solutions, {
    foreignKey: 'studentId',
    as: 'student'
});
