"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Carts", "studentNote", {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn("Carts", "deducted", {
        type: Sequelize.STRING,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Carts", "studentNote"),
      queryInterface.removeColumn("Carts", "deducted")
    ])
  }
}
