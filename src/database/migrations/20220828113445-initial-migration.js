'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    return [
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: true,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        banned: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
        },
        banReason: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        refreshTokenHash: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        chatSocketId: {
          type: Sequelize.STRING,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('Baskets', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          allowNull: false,
        },
      }),
      await queryInterface.addColumn('Users', 'basketId', {
        type: Sequelize.INTEGER,
        references: {
          model: 'Baskets',
          key: 'id',
        },
      }),
      await queryInterface.createTable('Roles', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        value: {
          type: Sequelize.STRING,
          unique: true,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('UserRoles', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        roleId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Roles',
            key: 'id',
          },
        },
      }),
      await queryInterface.createTable('ProductTypes', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('Products', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        description: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        price: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        image1: {
          type: Sequelize.STRING,
        },
        image2: {
          type: Sequelize.STRING,
        },
        image3: {
          type: Sequelize.STRING,
        },
        typeId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'ProductTypes',
            key: 'id',
          },
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('BasketProducts', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
        },
        quantity: {
          type: Sequelize.INTEGER,
        },
        price: {
          type: Sequelize.INTEGER,
        },
        subTotalPrice: {
          type: Sequelize.INTEGER,
        },
        basketId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Baskets',
            key: 'id',
          },
        },
        productId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
        },
      }),
      await queryInterface.createTable('ProductComments', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        author: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        text: {
          type: Sequelize.TEXT,
          allowNull: false,
        },
        productId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Products',
            key: 'id',
          },
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('Consultations', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        status: {
          type: Sequelize.ENUM({ values: ['Open', 'Closed'] }),
          defaultValue: 'Open',
        },
        type: {
          type: Sequelize.ENUM({ values: ['Support', 'Cosmetic'] }),
        },
        creatorId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('Messages', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        message: {
          type: Sequelize.TEXT,
        },
        consultationId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Consultations',
            key: 'id',
          },
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          allowNull: false,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('ActiveConsultations', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        socketId: {
          type: Sequelize.STRING,
        },
        consultationId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Consultations',
            key: 'id',
          },
          allowNull: false,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'Users',
            key: 'id',
          },
          allowNull: false,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }),
      await queryInterface.createTable('MessageAttachments', {
        id: {
          type: Sequelize.INTEGER,
          unique: true,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: DataType.TEXT,
          allowNull: false,
        },
        type: {
          type: DataType.STRING,
          allowNull: false,
        },
        name: {
          type: DataType.STRING,
          allowNull: false,
        },
        messageId: {
          type: DataType.INTEGER,
          references: {
            model: 'Messages',
            key: 'id',
          },
          allowNull: false,
        },
      }),
    ];
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserRoles');
    await queryInterface.dropTable('Roles');
    await queryInterface.dropTable('BasketProducts');
    await queryInterface.dropTable('ActiveConsultations');
    await queryInterface.dropTable('ProductComments');
    await queryInterface.dropTable('Products');
    await queryInterface.dropTable('ProductTypes');
    await queryInterface.dropTable('MessageAttachments');
    await queryInterface.dropTable('Messages');
    await queryInterface.dropTable('Consultations');
    await queryInterface.removeColumn('Users', 'basketId');
    await queryInterface.dropTable('Baskets');
    await queryInterface.dropTable('Users');
  },
};
