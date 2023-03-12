module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'claims',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        deletedAt: {
          type: Sequelize.DATE,
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('claims');
  },
};
