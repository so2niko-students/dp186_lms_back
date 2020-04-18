import { QueryInterface, Sequelize } from 'sequelize';
import { Students } from '../modules/students/students.model';

export async function up(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkInsert(Students.tableName, [
    {
      firstNameUkr: 'Вільгельм',
      lastNameUkr: 'Райнхардт',
      firstNameEng: 'Wilhelm',
      lastNameEng: 'Reinhardt',
      email: 'hammerdown@gmail.com',
      phoneNumber: '3925810273',
      password: '935u-nuw-j-5jaw35mgua9',
      groupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstNameUkr: 'Фарія',
      lastNameUkr: 'Амарі',
      firstNameEng: 'Fareeha',
      lastNameEng: 'Amari',
      email: 'phara@gmail.com',
      phoneNumber: '23094234',
      password: 'pajeaeshtaset-asehtsetha',
      groupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstNameUkr: 'Мако',
      lastNameUkr: 'Рутледж',
      firstNameEng: 'Mako',
      lastNameEng: 'Rutledge',
      email: 'roadhog@gmail.com',
      phoneNumber: '2043094283094',
      password: 'dzsrha-sdfasdfu-asdufa',
      groupId: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      firstNameUkr: 'Ліна',
      lastNameUkr: 'Окстон',
      firstNameEng: 'Lena',
      lastNameEng: 'Oxton',
      email: 'tracer@gmail.com',
      phoneNumber: '109353217',
      password: 'apjfh2q-j-5jaw35mgua9',
      groupId: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
}

export async function down(query: QueryInterface, sequelize: Sequelize) {
  return query.bulkDelete(Students.tableName, null, {});
}
