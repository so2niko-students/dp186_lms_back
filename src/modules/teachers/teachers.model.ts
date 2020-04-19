import { DataTypes, FindOptions, Model, ModelCtor, Sequelize } from "sequelize";
import { sequelize } from "../../database";
class Teachers extends Model {
  public static readonly ModelName: string = "teacher";
  public static readonly TableName: string = "teachers";

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
      }
    );
  }

  // public static setAssociations(modelCtors: { [modelName: string]: ModelCtor<Model> }) {}
}

Teachers.prepareInit(sequelize);

export default Teachers;
