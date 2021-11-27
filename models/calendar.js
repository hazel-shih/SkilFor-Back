"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Calendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Calendar.hasMany(models.Schedule, {
        foreignKey: "calendarId"
      })
    }
  }
  Calendar.init(
    {
      datetime: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "Calendar"
    }
  )
  return Calendar
}
