"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Students", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      email: {
        unique: true,
        type: Sequelize.STRING
      },
      contactEmail: {
        type: Sequelize.STRING
      },
      password: {
        unique: true,
        type: Sequelize.STRING
      },
      avatar: {
        type: Sequelize.STRING
      },
      points: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable("Students")
  }
}
