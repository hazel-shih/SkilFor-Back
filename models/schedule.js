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
      Schedule.belongsTo(models.Course, {
        foreignKey: "courseId",
        onDelete: "CASCADE"
      })
      Schedule.belongsTo(models.Student, {
        foreignKey: "studentId"
      })
      Schedule.hasMany(models.Order, {
        foreignKey: "ScheduleId"
      })
      Schedule.hasOne(models.Order, {
        foreignKey: "ScheduleId"
      })
    }
  }
  Schedule.init(
    {
      courseId: DataTypes.STRING,
      dateTime: DataTypes.DATE,
      studentId: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Schedule"
    }
  )
  return Schedule
}
