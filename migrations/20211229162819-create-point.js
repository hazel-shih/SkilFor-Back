"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Points", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      studentId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Students",
          key: "id",
          as: "studentId"
        }
      },
      amount: {
        type: Sequelize.INTEGER
      },
      success: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Points")
  }
}
