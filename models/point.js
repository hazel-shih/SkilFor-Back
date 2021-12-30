"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 6)
const { Model } = require("sequelize")

module.exports = (sequelize, DataTypes) => {
  class Point extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Point.belongsTo(models.Student, {
        foreignKey: "studentId",
        onDelete: "CASCADE"
      })
    }
  }
  Point.init(
    {
      studentId: DataTypes.STRING,
      itemName: DataTypes.STRING,
      totalAmount: DataTypes.INTEGER,
      totalPoint: DataTypes.INTEGER,
      success: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeCreate: (point, option) => {
          point.id = `skilfor${nanoid()}`
        }
      },
      sequelize,
      modelName: "Point"
    }
  )
  return Point
}
