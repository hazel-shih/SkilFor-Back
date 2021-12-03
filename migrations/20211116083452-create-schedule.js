"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      courseId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Courses",
          key: "id",
          as: "courseId"
        }
      },
      dateTime: {
        type: Sequelize.DATE
      },
      studentId: {
        type: Sequelize.STRING,
        references: {
          model: "Students",
          key: "id",
          as: "studentId"
        }
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
    await queryInterface.dropTable("Schedules")
  }
}
