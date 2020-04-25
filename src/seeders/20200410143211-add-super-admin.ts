import { QueryInterface, Sequelize } from 'sequelize';
import { hashFunc } from '../modules/auth/password.hash';
import { Teachers } from '../modules/teachers/teachers.model'

export async function up(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkInsert(Teachers.tableName, [
      {
        firstName: 'Alan',
        lastName: 'Morgan',
        email: "alanmorgan@gmail.com",
        password: hashFunc("superAdmin"),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  }

export async function down(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkDelete('teachers', null, {});
  }
