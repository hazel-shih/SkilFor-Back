"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 6)
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Teacher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Teacher.hasMany(models.Course, {
        foreignKey: "teacherId"
      })
    }
  }
  Teacher.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      contactEmail: DataTypes.STRING,
      avatar: DataTypes.STRING
    },
    {
      hooks: {
        beforeCreate: (teacher, option) => {
          teacher.id = nanoid()
        }
      },
      sequelize,
      modelName: "Teacher"
    }
  )
  return Teacher
}
