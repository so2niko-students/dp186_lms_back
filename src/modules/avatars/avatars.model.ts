import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Groups } from '../groups/groups.model';
import { Teachers } from '../teachers/teachers.model';
import { Students } from '../students/students.model';

export class Avatars extends Model {
  public static readonly tableName: string = 'avatars';

  public id!: number;
  public avatarLink: string;
  public createdAt: Date;
  public updatedAt: Date;

  public static prepareInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          defaultValue: DataTypes.INTEGER,
          comment: 'Id of the instance',
        },
        avatarLink: {
          type: DataTypes.STRING,
          allowNull: false,
          comment: 'Link to the avatar image'
        }
      },
      {
        sequelize,
        tableName: this.tableName,
      },
    );
  }
}

Avatars.prepareInit(sequelize);

Avatars.hasOne(Groups, {
  sourceKey: 'id',
  foreignKey: 'avatarId',
  as: 'groups'
});

Groups.belongsTo(Avatars, {targetKey: 'id'});

Avatars.hasOne(Teachers, {
  sourceKey: 'id',
  foreignKey: 'avatarId',
  as: 'teachers'
});

Teachers.belongsTo(Avatars, {targetKey: 'id'});

Avatars.hasOne(Students, {
  sourceKey: 'id',
  foreignKey: 'avatarId',
  as: 'studets'
});

Students.belongsTo(Avatars, {targetKey: 'id'});
