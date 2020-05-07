'use strict';
import {DataTypes, QueryInterface} from "sequelize";

export async function up(query: QueryInterface) {
  return query.sequelize.transaction( t => {
    return Promise.all([
      query.addColumn('teachers', 'resetPasswordToken', {
        type: DataTypes.STRING,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction: t }),
      query.addColumn('teachers', 'resetPasswordExpire', {
        type: DataTypes.DATE,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction: t }),
      query.addColumn('students', 'resetPasswordToken', {
        type: DataTypes.STRING,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction: t }),
      query.addColumn('students', 'resetPasswordExpire', {
        type: DataTypes.DATE,
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      }, { transaction: t })
    ]);
  });
}

export async function down(query: QueryInterface) {
  return query.sequelize.transaction( t => {
    return Promise.all([
      query.removeColumn('teachers', 'resetPasswordToken', { transaction: t }),
      query.removeColumn('teachers', 'resetPasswordExpire', { transaction: t }),
      query.removeColumn('students', 'resetPasswordExpire', { transaction: t }),
      query.removeColumn('students', 'resetPasswordToken', { transaction: t })
    ]);
  });
}
