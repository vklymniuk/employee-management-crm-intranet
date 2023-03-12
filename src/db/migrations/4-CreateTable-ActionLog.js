module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'actionLogs',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        actionType: {
          type: Sequelize.STRING,
        },
        newData: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        oldData: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        changes: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        entityType: {
          type: Sequelize.STRING,
        },
        createdAt: {
          type: Sequelize.DATE,
        },
        userId: {
          type: Sequelize.INTEGER,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('actionLogs');
  },
};
