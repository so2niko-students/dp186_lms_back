import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';

export class Groups extends Model {
  public static readonly TableName: string = 'groups';

  public id!: number;
  public groupName: string;
  public groupToken: string;
  public teacherId: number;
  public createdAt: Date;
  public updatedAt: Date;

  public static prepareInit(seq: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          allowNull: false,
          autoIncrement: true,
        },
        groupName: {
          type: DataTypes.STRING(),
          allowNull: false,
        },
        groupToken: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        teacherId: {
          type: DataTypes.INTEGER(),
          allowNull: true,
        },
      },
      { sequelize, tableName: this.TableName },
    );
  }
}

Groups.prepareInit(sequelize);
