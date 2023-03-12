module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      'roleClaims',
      {
        roleId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'roles',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        claimId: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          references: {
            model: 'claims',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
      },
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable('roleClaims');
  },
};
