import { QueryInterface, Sequelize } from 'sequelize';

export async function up(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkInsert("Teachers", [
    {
      firstName: 'Nick',
      lastName: 'Sotula',
      email: 'email1',
      password: '123456',
      isAdmin: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Alex',
      lastName: 'Ostapiuk',
      email: 'email2',
      password: '123456456',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstName: 'Gregor',
      lastName: 'Eisenhorn',
      email: 'email3',
      password: '12345',
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkDelete('Teachers', null, {});
}
