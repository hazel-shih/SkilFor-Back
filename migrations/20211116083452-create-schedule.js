"use strict"
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Schedules", {
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
      courseId: {
        type: Sequelize.STRING,
        onDelete: "CASCADE",
        references: {
          model: "Courses",
          key: "id",
          as: "courseId"
        }
      },
      studentId: {
        defaultValue: null,
        type: Sequelize.STRING,
        references: {
          model: "Students",
          key: "id",
          as: "studentId"
        }
      },
      startTime: {
        type: Sequelize.STRING
      },
      finishTime: {
        type: Sequelize.STRING
      },
      studentNote: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      month: {
        type: Sequelize.INTEGER
      },
      eventColor: {
        type: Sequelize.STRING
      },
      reservedPrice: {
        defaultValue: null,
        type: Sequelize.STRING
      },
      meetingLink: {
        type: Sequelize.STRING
      },
      exist: {
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
    await queryInterface.dropTable("Schedules")
  }
}
