"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Calendars",
      [
        {
          datetime: "2021-11-17 00:00:00"
        },
        {
          datetime: "2021-11-17 01:00:00"
        },
        {
          datetime: "2021-11-17 02:00:00"
        },
        {
          datetime: "2021-11-17 03:00:00"
        },
        {
          datetime: "2021-11-17 04:00:00"
        },
        {
          datetime: "2021-11-17 05:00:00"
        },
        {
          datetime: "2021-11-17 06:00:00"
        },
        {
          datetime: "2021-11-17 07:00:00"
        },
        {
          datetime: "2021-11-17 08:00:00"
        },
        {
          datetime: "2021-11-17 09:00:00"
        },
        {
          datetime: "2021-11-17 10:00:00"
        },
        {
          datetime: "2021-11-17 11:00:00"
        },
        {
          datetime: "2021-11-17 12:00:00"
        },
        {
          datetime: "2021-11-17 13:00:00"
        },
        {
          datetime: "2021-11-17 14:00:00"
        },
        {
          datetime: "2021-11-17 15:00:00"
        },
        {
          datetime: "2021-11-17 16:00:00"
        },
        {
          datetime: "2021-11-17 17:00:00"
        },
        {
          datetime: "2021-11-17 18:00:00"
        },
        {
          datetime: "2021-11-17 19:00:00"
        },
        {
          datetime: "2021-11-17 20:00:00"
        },
        {
          datetime: "2021-11-17 21:00:00"
        },
        {
          datetime: "2021-11-17 22:00:00"
        },
        {
          datetime: "2021-11-17 23:00:00"
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Calendars", null, {})
  }
}
