"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Carts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      scheduleId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Schedules",
          key: "id",
          as: "scheduleId"
        }
      },
      deducted: {
        defaultValue: false,
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
    await queryInterface.dropTable("Carts")
  }
}
