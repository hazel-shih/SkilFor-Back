"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.Schedule, {
        foreignKey: "scheduleId",
        onDelete: "CASCADE"
      })
      Order.belongsTo(models.Student, {
        foreignKey: "studentId",
        onDelete: "CASCADE"
      })
    }
  }
  Order.init(
    {
      studentId: DataTypes.STRING,
      scheduleId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "Order"
    }
  )
  return Order
}
