import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';

export class Teachers {
  
  public static readonly ModelName: string = 'teacher';
  public static readonly TableName: string = 'teachers';

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
        firstName: DataTypes.STRING(255),
        lastName: DataTypes.STRING(255),
        email: DataTypes.STRING(255),
        password: DataTypes.STRING(10),
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