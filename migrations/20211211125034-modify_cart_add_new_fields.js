"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn("Carts", "deducted", {
        type: Sequelize.BOOLEAN,
        allowNull: true
      })
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn("Carts", "deducted")])
  }
}
