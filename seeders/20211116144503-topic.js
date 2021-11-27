"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Topics",
      [
        {
          courseId: 1,
          name: "主題 A"
        },
        {
          courseId: 1,
          name: "主題 B"
        },
        {
          courseId: 2,
          name: "主題 A"
        },
        {
          courseId: 2,
          name: "主題 B"
        },
        {
          courseId: 3,
          name: "主題 A"
        },
        {
          courseId: 3,
          name: "主題 B"
        },
        {
          courseId: 4,
          name: "主題 A"
        },
        {
          courseId: 4,
          name: "主題 B"
        },
        {
          courseId: 5,
          name: "主題 A"
        },
        {
          courseId: 5,
          name: "主題 B"
        },
        {
          courseId: 6,
          name: "主題 A"
        },
        {
          courseId: 6,
          name: "主題 B"
        },
        {
          courseId: 7,
          name: "主題 A"
        },
        {
          courseId: 7,
          name: "主題 B"
        },
        {
          courseId: 8,
          name: "主題 A"
        },
        {
          courseId: 8,
          name: "主題 B"
        },
        {
          courseId: 9,
          name: "主題 A"
        },
        {
          courseId: 9,
          name: "主題 B"
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Topics", null, {})
  }
}
