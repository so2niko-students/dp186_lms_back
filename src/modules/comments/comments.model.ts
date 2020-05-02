import { DataTypes, Model, Sequelize } from 'sequelize';
import {sequelize} from '../../database';
import {Teachers} from '../teachers/teachers.model';
import {Students} from '../students/students.model';
import {Solution} from '../solutions/solutions.model';


export class Comment extends Model {
    public static readonly tableName: string = 'comments';

    public id: number;
    public solutionId: number;
    public studentId: number;
    public teacherId: number;
    public text: string;
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
                solutionId: {
                    type: DataTypes.INTEGER(),
                    allowNull: false,
                },
                studentId: {
                    type: DataTypes.INTEGER(),
                    allowNull: true,
                },
                teacherId: {
                    type: DataTypes.INTEGER(),
                    allowNull: true,
                },
                text: {
                    type: DataTypes.STRING(),
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

Comment.prepareInit(sequelize);

Comment.belongsTo(Solution, {
    foreignKey: 'solutionId',
    as: 'solution'
});

Solution.hasMany(Comment, {
    foreignKey: 'solutionId',
});

Comment.belongsTo(Students, {
    foreignKey: 'studentId',
    as: 'student',
});

Students.hasMany(Comment, {
    foreignKey: 'studentId',
});

Comment.belongsTo(Teachers, {
    // foreignKey: 'teacherId',
    // as: 'teacher',
});

Teachers.hasMany(Comment, {
    foreignKey: 'teacherId',
});
