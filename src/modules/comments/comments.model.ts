import { DataTypes, Model, Sequelize } from 'sequelize';
import {sequelize} from '../../database';
import {Teachers} from '../teachers/teachers.model';
import {Students} from '../students/students.model';
import {Solutions} from '../solutions/solutions.model';


export class Comments extends Model {
    public static readonly tableName: string = 'comments';

    public id!: number;
    public solutionId: number;
    public studentId: number;
    public teacherId: number;
    public text: string;
    public dateCreate: Date;
    public filesLink: string;
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
                dateCreate: {
                    type: DataTypes.DATE(),
                    allowNull: false,
                },
                filesLink: {
                    type: DataTypes.STRING(),
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

Comments.prepareInit(sequelize);

Comments.belongsTo(Solutions, {
    foreignKey: 'solutionId',
    as: 'solution'
});

Solutions.hasMany(Comments, {
    foreignKey: 'solutionId',
    as: 'solution',
});

Comments.belongsTo(Students, {
    foreignKey: 'studentId',
    // as: 'student',
});

Students.hasMany(Comments, {
    foreignKey: 'studentId',
    // as: 'student',
});

Comments.belongsTo(Teachers, {
    foreignKey: 'teacherId',
    as: 'teacher',
});

Teachers.hasMany(Comments, {
    foreignKey: 'teacherId',
    as: 'teacher',
});
