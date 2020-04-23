import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Groups } from '../groups/groups.model';

export class Students extends Model {
  public static readonly tableName: string = 'students';

  public id: number;
  public firstNameUkr: string;
  public lastNameUkr: string;
  public firstNameEng: string;
  public lastNameEng: string;
  public email: string;
  public phoneNumber: string;
  public password: string;
  public groupId: number;
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
        firstNameUkr: DataTypes.STRING(),
        lastNameUkr: DataTypes.STRING(),
        firstNameEng: DataTypes.STRING(),
        lastNameEng: DataTypes.STRING(),
        email: DataTypes.STRING(),
        phoneNumber: DataTypes.STRING(),
        password: DataTypes.STRING(),
        groupId: DataTypes.INTEGER(),
      },
      {
        sequelize,
        tableName: this.tableName,
      }
    );
  }
}

Students.prepareInit(sequelize);

Students.belongsTo(Groups, {
  foreignKey: 'groupId',
  as: 'group',
});

Groups.hasMany(Students, {
  foreignKey: 'groupId',
  as: 'group',
});
