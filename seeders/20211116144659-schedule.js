'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Schedules', [{
       courseId: 1,
       calendarId: 1,
       studentId: null
     },{
       courseId: 1,
       calendarId: 2,
       studentId: null    
     },{
       courseId: 1,
       calendarId: 3,
       studentId: null    
     },{
       courseId: 2,
       calendarId: 4,
       studentId: null    
     },{
       courseId: 2,
       calendarId: 5,
       studentId: null    
     },{
       courseId: 2,
       calendarId: 6,
       studentId: null    
     },{
       courseId: 3,
       calendarId: 7,
       studentId: null    
     },{
       courseId: 3,
       calendarId: 8,
       studentId: null    
     },{
       courseId: 3,
       calendarId: 9,
       studentId: null    
     },{
       courseId: 4,
       calendarId: 10,
       studentId: null    
     },{
       courseId: 4,
       calendarId: 11,
       studentId: null    
     },{
       courseId: 4,
       calendarId: 12,
       studentId: null    
     },{
       courseId: 5,
       calendarId: 13,
       studentId: null    
     },{
       courseId: 5,
       calendarId: 14,
       studentId: null    
     },{
       courseId: 5,
       calendarId: 15,
       studentId: null    
     },{
       courseId: 6,
       calendarId: 16,
       studentId: null    
     },{
       courseId: 6,
       calendarId: 17,
       studentId: null    
     },{
       courseId: 6,
       calendarId: 18,
       studentId: null    
     },{
       courseId: 7,
       calendarId: 19,
       studentId: null    
     },{
       courseId: 7,
       calendarId: 20,
       studentId: null    
     },{
       courseId: 7,
       calendarId: 21,
       studentId: null    
     },{
       courseId: 8,
       calendarId: 22,
       studentId: null    
     },{
       courseId: 8,
       calendarId: 23,
       studentId: null    
     },{
       courseId: 8,
       calendarId: 24,
       studentId: null    
     },{
       courseId: 9,
       calendarId: 1,
       studentId: null    
     },{
       courseId: 9,
       calendarId: 2,
       studentId: null    
     },{
       courseId: 9,
       calendarId: 3,
       studentId: null    
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Schedules', null, {});
  }
};

