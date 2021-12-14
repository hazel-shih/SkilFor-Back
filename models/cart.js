"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Cart.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE"
      })
      Cart.belongsTo(models.Student, {
        foreignKey: "studentId",
        onDelete: "CASCADE"
      })
    }
  }
  Cart.init(
    {
      studentId: DataTypes.STRING,
      scheduleId: DataTypes.STRING,
      studentNote: DataTypes.STRING,
      deducted: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Cart"
    }
  )
  return Cart
}
