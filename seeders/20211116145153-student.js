'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Students', [{
       username: 'Wang Xin',
       password: 'Pei',
       points: 1000
     },{
       username: 'Chiu Jiang',
       password: 'How',
       points: 1000    
     },{
       username: 'Tai Tzu',
       password: 'Ying',
       points: 1000
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Students', null, {});
  }
};

