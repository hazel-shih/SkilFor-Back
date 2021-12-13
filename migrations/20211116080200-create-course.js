"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Courses", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING
      },
      teacherId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Teachers",
          key: "id",
          as: "teacherId"
        }
      },
      categoryId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Categories",
          key: "id",
          as: "categoryId"
        }
      },
      name: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER
      },
      published: {
        type: Sequelize.BOOLEAN
      },
      audit: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable("Courses")
  }
}
