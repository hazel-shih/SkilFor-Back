"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Teachers",
      [
        {
          username: "John Doe",
          password: "abc"
        },
        {
          username: "Wang Chiang",
          password: "123"
        },
        {
          username: "Zhang Shaui",
          password: "xyz"
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Teachers", null, {})
  }
}
