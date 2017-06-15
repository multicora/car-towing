module.exports = function () {
  return {
    calculate: function (contracts) {
      let endDates = [];
      let endTime = [];
      let timeToEnd;
      let i = 0;
      let j = 0;
      let notExpire;

      for (; i < contracts.length; i++) {
        if (contracts[i].notExpire) {
          notExpire = true;
        }
        endDates.push(new Date(new Date(contracts[i].activationDate).getTime() + contracts[i].term) - new Date);
      }

      timeToEnd = endDates[0];

      for (; j < endDates.length; j++) {
        if (endDates[j] > timeToEnd) {
          timeToEnd = endDates[j];
        }
      }

      return {
        timeToEnd: timeToEnd,
        notExpire: notExpire
      };
    }
  };
};
