'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Orders', 'phone', {
      type: Sequelize.STRING,
    });
    await queryInterface.addColumn('Orders', 'address', {
      type: Sequelize.STRING,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('Orders', 'phone');
    await queryInterface.removeColumn('Orders', 'address');
  },
};
