import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';

export interface IStudent {
    id?: number;
    first_name_ukr: string;
    last_name_ukr: string;
    first_name_eng: string;
    last_name_eng: string;
    email: string;
    phone_number: number;
    password: string;
    group_id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export class Student extends Model implements IStudent {
    // public static readonly ModelName: string = 'Student';
    // public static readonly ModelNamePlural: string = 'Students';
    public static readonly TableName: string = 'Students';

    public id!: number;
    public first_name_ukr: string;
    public last_name_ukr: string;
    public first_name_eng: string;
    public last_name_eng: string;
    public email: string;
    public phone_number: number;
    public password: string;
    public group_id: number;
    public createdAt: Date;
    public updatedAt: Date;

    // region Static
    public static prepareInit(sequelize: Sequelize) {

        this.init(
            {
                id: {
                    type: DataTypes.INTEGER,
                    primaryKey: true,
                    allowNull: false,
                    autoIncrement: true,
                },
                first_name_ukr: new DataTypes.STRING(),
                last_name_ukr: new DataTypes.STRING(),
                first_name_eng: new DataTypes.STRING(),
                last_name_eng: new DataTypes.STRING(),
                email: new DataTypes.STRING(),
                phone_number: new DataTypes.DOUBLE(),
                password: new DataTypes.STRING(),
                group_id: new DataTypes.INTEGER()
            }, {
                sequelize: sequelize,
                tableName: this.TableName,
            }
        );
    }
}
