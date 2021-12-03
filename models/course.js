"use strict"
const { customAlphabet } = require("nanoid")
const nanoid = customAlphabet("1234567890", 8)
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //define association here
      Course.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        onDelete: "CASCADE"
      })
      Course.belongsTo(models.Category, {
        foreignKey: "categoryId",
        onDelete: "CASCADE"
      })
      Course.hasMany(models.Topic, {
        foreignKey: "courseId"
      })
      Course.hasMany(models.Schedule, {
        foreignKey: "courseId"
      })
    }
  }
  Course.init(
    {
      teacherId: DataTypes.STRING,
      categoryId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.INTEGER,
      audit: DataTypes.STRING,
      published: DataTypes.BOOLEAN
    },
    {
      hooks: {
        beforeCreate: (course, option) => {
          course.id = nanoid()
        }
      },
      sequelize
    }
  )
  return Course
}
