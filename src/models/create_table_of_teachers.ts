import { DataTypes, FindOptions, Model, ModelCtor, Sequelize } from 'sequelize';

export interface ITeacher {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Teachers implements ITeacher {
  
  public static readonly ModelName: string = 'Teacher';
  public static readonly TableName: string = 'Teachers';

  public id!: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public createdAt: Date;
  public updatedAt: Date;
  static init: any;

  public static prepareInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        firstName: new DataTypes.STRING(255),
        lastName: new DataTypes.STRING(255),
        email: new DataTypes.STRING(255),
        password: new DataTypes.STRING(10),
        isAdmin: DataTypes.BOOLEAN,
      },
      {
        sequelize: sequelize,
        tableName: this.TableName,
      },
    );
  }

  public static setAssociations(modelCtors: {
    [modelName: string]: ModelCtor<Model>;
  }) {
  }
}