import { QueryInterface, Sequelize } from 'sequelize';

export async function up(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkInsert('teachers', [
      {
        id: 1,
        firstName: 'Alan',
        lastName: 'Morgan',
        email: "alanmorgan@gmail.com",
        password: "admin",
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  }

export async function down(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkDelete('teachers', null, {});
  }
