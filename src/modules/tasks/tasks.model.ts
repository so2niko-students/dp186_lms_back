import { DataTypes, Model, Sequelize } from 'sequelize';
import { sequelize } from '../../database';
import { Groups } from '../groups/groups.model';

export class Tasks extends Model {
  public static readonly tableName: string = 'tasks';

  public id: number;
  public groupId: number;
  public taskName: string;
  public description!: string;
  public createdAt: Date;
  public updatedAt: Date;
  public averageGrade!: number;
  public amountOfChecked!: number;
  public amountOfReady!: number;

  public static prepareInit(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
          comment: 'Id of the instance',
        },
        groupId: DataTypes.INTEGER,
        taskName: DataTypes.STRING(255),
        description: DataTypes.TEXT,
        averageGrade: DataTypes.VIRTUAL,
        amountOfChecked: DataTypes.VIRTUAL,
        amountOfReady: DataTypes.VIRTUAL,
      },
      {
        sequelize,
        tableName: this.tableName,
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

Tasks.belongsTo(Groups, {
  foreignKey: 'groupId',
  as: 'tasks'
});
