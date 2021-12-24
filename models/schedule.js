"use strict"
const { Model } = require("sequelize")
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Teacher, {
        foreignKey: "teacherId",
        onDelete: "CASCADE"
      })
      Schedule.belongsTo(models.Course, {
        foreignKey: "courseId",
        onDelete: "CASCADE"
      })
      Schedule.belongsTo(models.Student, {
        foreignKey: "studentId"
      })
      Schedule.hasMany(models.Cart, {
        foreignKey: "ScheduleId"
      })
      Schedule.hasOne(models.Order, {
        foreignKey: "ScheduleId"
      })
    }
  }
  Schedule.init(
    {
      title: DataTypes.STRING,
      courseId: DataTypes.STRING,
      startTime: DataTypes.STRING,
      finishTime: DataTypes.STRING,
      studentId: DataTypes.STRING,
      studentNote: DataTypes.STRING,
      eventColor: DataTypes.STRING,
      month: DataTypes.INTEGER,
      reservedPrice: DataTypes.INTEGER,
      exist: DataTypes.BOOLEAN
    },
    {
      sequelize,
      modelName: "Schedule"
    }
  )
  return Schedule
}
