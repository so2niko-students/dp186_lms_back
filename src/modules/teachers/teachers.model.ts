import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';

export class Teachers extends Model {
    public static readonly tableName: string = 'teachers';

  public id: number;
  public firstName: string;
  public lastName: string;
  public email: string;
  public password: string;
  public isAdmin: boolean;
  public resetPasswordToken: string;
  public resetPasswordExpire: number;
  public createdAt: Date;
  public updatedAt: Date;
  public avatarId: number;

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
        password: DataTypes.STRING(100),
        isAdmin: DataTypes.BOOLEAN,
        resetPasswordToken: DataTypes.STRING(255),
        resetPasswordExpire: DataTypes.DATE(),
        avatarId: {
            type: DataTypes.INTEGER,
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

Teachers.prepareInit(sequelize);
