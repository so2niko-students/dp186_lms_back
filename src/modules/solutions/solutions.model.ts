import { DataTypes, Model, Sequelize } from 'sequelize';
import {sequelize} from '../../database';
import {Tasks} from '../tasks/tasks.model';
import {Students} from '../students/students.model';

export class Solution extends Model {
    public static readonly tableName: string = 'solutions';

    public id: number;
    public studentId: number;
    public taskId: number;
    public grade: number;
    public createdAt: Date;
    public updatedAt: Date;
    public isCompleted: number;

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
                grade: {
                    type: DataTypes.NUMBER(),
                    allowNull: true,
                },
                isCompleted: {
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

Solution.prepareInit(sequelize);

Solution.belongsTo(Tasks, {
    foreignKey: 'taskId',
    as: 'task'
});

Tasks.hasMany(Solution, {
    foreignKey: 'taskId',
    onDelete: 'cascade'
});

Solution.belongsTo(Students, {
    foreignKey: 'studentId',
    as: 'student'
});

Students.hasOne(Solution, {
    foreignKey: 'studentId',
    onDelete: 'cascade',
    as: 'student'
});
