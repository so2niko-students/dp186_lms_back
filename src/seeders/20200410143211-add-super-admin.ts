import { QueryInterface, Sequelize } from 'sequelize';
import { hashFunc } from '../modules/auth/password.hash';

export async function up(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkInsert('teachers', [
      {
        firstName: 'Alan',
        lastName: 'Morgan',
        email: 'alanmorgan@gmail.com',
        password: hashFunc('superAdmin'),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }

export async function down(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkDelete('teachers', null, {});
  }
