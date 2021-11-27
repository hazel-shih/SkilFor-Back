"use strict"

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "Teachers", // table name
        "contactEmail", // new field name
        {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        }
      )
    ])
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn("Teachers", "contactEmail")
    ])
  }
}
