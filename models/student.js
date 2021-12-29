"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 6)
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Student.hasMany(models.Schedule, {
        foreignKey: "studentId"
      })
      Student.hasMany(models.Cart, {
        foreignKey: "studentId"
      })
      Student.hasMany(models.Order, {
        foreignKey: "studentId"
      })
      Student.hasMany(models.Point, {
        foreignKey: "studentId"
      })
    }
  }
  Student.init(
    {
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      email: DataTypes.STRING,
      contactEmail: DataTypes.STRING,
      avatar: DataTypes.STRING,
      points: DataTypes.INTEGER
    },
    {
      hooks: {
        beforeCreate: (student, option) => {
          student.id = nanoid()
        }
      },
      sequelize,
      modelName: "Student"
    }
  )
  return Student
}
