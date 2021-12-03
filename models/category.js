"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 4)
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Course, {
        foreignKey: "categoryId"
      })
    }
  }
  Category.init(
    {
      name: DataTypes.STRING,
      displayName: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (category, option) => {
          Category.id = nanoid()
        }
      },
      sequelize,
      modelName: "Category"
    }
  )
  return Category
}
