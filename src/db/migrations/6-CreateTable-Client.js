module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'clients',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('clients');
  },
};
