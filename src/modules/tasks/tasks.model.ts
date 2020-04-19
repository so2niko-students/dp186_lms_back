import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Groups } from '../groups/groups.model';

export class Tasks extends Model {
  public static readonly TableName: string = 'tasks';

  public id!: number;
  public groupId: number;
  public taskName: string;
  public fileURL: string;
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
        groupId: DataTypes.INTEGER,
        taskName: DataTypes.STRING(255),
        fileURL: DataTypes.STRING(255),
      },
      {
        sequelize: sequelize
      },
    );
  }
}

Tasks.prepareInit(sequelize);

Groups.hasMany(Tasks, {
  sourceKey: 'id',
  foreignKey: 'groupId',
  as: 'tasks'
});

Tasks.belongsTo(Groups, {targetKey: 'id'});