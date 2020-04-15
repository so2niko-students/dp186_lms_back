import { DataTypes, Model, Sequelize } from 'sequelize';

export interface IGroup {
  id?: number;
  group_name: string;
  group_token: string;
  mentor_id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export class Group extends Model implements IGroup {
  public static readonly ModelName: string = 'Group';
  public static readonly ModelNamePlural: string = 'Groups';
  public static readonly TableName: string = 'Group';

  public id!: number;
  public group_name: string;
  public group_token: string;
  public mentor_id: number;
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
        group_name: new DataTypes.STRING(),
        group_token: new DataTypes.STRING(255),
        mentor_id: new DataTypes.INTEGER(),
      }, { sequelize }
    );
  }
}
