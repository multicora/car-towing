'use strict';

const schedule = require('node-schedule');

// module.exports = function () {
//   schedule.scheduleJob(' */1 * * * *', function(){
//   // var j = schedule.scheduleJob(' * * */1 * *', function(){

//     console.log('The answer to life, the universe, and everything!');
//   });
// };
module.exports = {
  createDaylyJob: function (cb) {
    return schedule.scheduleJob(' * * */1 * *', function(){
      cb();
    });
  }
};