"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 6)
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Administrator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Administrator.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      contactEmail: DataTypes.STRING,
      password: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (administrator, option) => {
          administrator.id = nanoid()
        }
      },
      sequelize,
      modelName: "Administrator"
    }
  )
  return Administrator
}
