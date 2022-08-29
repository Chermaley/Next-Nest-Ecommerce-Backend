'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Roles', [
      {
        value: 'ADMIN',
        description: 'Администратор',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 'CONSULT',
        description: 'Косметолог',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        value: 'USER',
        description: 'Пользователь',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Roles', null, {});
  },
};
