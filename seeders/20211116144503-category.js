'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
     await queryInterface.bulkInsert('Categories', [{
       name: '棋藝'
     },{
       name: '設計'     
     },{
       name: '語言'
     },{
       name: '繪圖'
     },{
       name: '心理'
     }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Categories', null, {});
  }
};

