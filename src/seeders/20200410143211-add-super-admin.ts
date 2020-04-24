import { QueryInterface, Sequelize } from 'sequelize';

export async function up(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkInsert('teachers', [
      {
        firstName: 'Alan',
        lastName: 'Morgan',
        email: "alanmorgan@gmail.com",
        password: "$2a$10$29Y4I9VzkAxtRfCo0ZTXHOgXoiyWHBzHSv9A9W.1MxJJX8tgT.y3.",
        isAdmin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ])
  }

export async function down(query: QueryInterface, sequelize: Sequelize) {
    return query.bulkDelete('teachers', null, {});
  }
