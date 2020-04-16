import { DataTypes, Model, Sequelize } from 'sequelize';

export interface IGroups {
  id?: number;
  group_name: string;
  group_token: string;
  teacher_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Groups extends Model implements IGroups {
  public static readonly TableName: string = 'Groups';

  public id!: number;
  public group_name: string;
  public group_token: string;
  public teacher_id: number;
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
        group_name: new DataTypes.STRING(),
        group_token: new DataTypes.STRING(255),
        teacher_id: new DataTypes.INTEGER(),
      }, { sequelize }
    );
  }
}
