'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Products', 'rating', {
      type: Sequelize.FLOAT,
    });
    await queryInterface.addColumn('ProductComments', 'rating', {
      type: Sequelize.FLOAT,
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('ProductComments', 'rating');
    await queryInterface.removeColumn('Products', 'rating');
  },
};
