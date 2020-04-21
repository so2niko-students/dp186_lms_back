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
        avatarLink: DataTypes.INTEGER,
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
  as: 'avatarForGroups'
});

Groups.belongsTo(Avatars, {targetKey: 'id'});

Avatars.hasOne(Teachers, {
  sourceKey: 'id',
  foreignKey: 'avatarId',
  as: 'avatarForTeachers'
});

Teachers.belongsTo(Avatars, {targetKey: 'id'});

Avatars.hasOne(Students, {
  sourceKey: 'id',
  foreignKey: 'avatarId',
  as: 'avatarForStudets'
});

Students.belongsTo(Avatars, {targetKey: 'id'});
