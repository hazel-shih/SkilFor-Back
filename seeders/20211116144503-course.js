"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Courses",
      [
        {
          teacherId: 1,
          categoryId: 1,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 1,
          categoryId: 2,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 1,
          categoryId: 3,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 2,
          categoryId: 2,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 2,
          categoryId: 3,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 2,
          categoryId: 4,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 3,
          categoryId: 3,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 3,
          categoryId: 4,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        },
        {
          teacherId: 3,
          categoryId: 5,
          fee: 100,
          description: "專業清新",
          show: 1,
          qualify: 1
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Courses", null, {})
  }
}
