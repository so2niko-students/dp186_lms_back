import { QueryInterface, Sequelize } from 'sequelize';
import {hashSync} from 'bcrypt';

export async function up(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkInsert('teachers', [
      {
        firstName: 'Alan',
        lastName: 'Morgan',
        email: 'alanmorgan@gmail.com',
        password: hashSync('admin', 10),
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  }

export async function down(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkDelete('teachers', null, {});
  }
