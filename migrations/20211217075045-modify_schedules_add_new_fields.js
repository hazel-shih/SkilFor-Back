"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Schedules", "reservedPrice", {
        type: Sequelize.INTEGER,
        allowNull: true
      }),
      queryInterface.addColumn("Schedules", "meetingLink", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Schedules", "reservedPrice"),
      queryInterface.removeColumn("Schedules", "meetingLink")
    ])
  }
}
