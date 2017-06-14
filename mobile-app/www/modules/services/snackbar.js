(function () {
  'use strict';

  angular.module('carTowingApp').factory('snackbar', service);

  service.$inject = [];
  function service() {
    var POSITION = {
      BOTTOM_RIGHT: 'bottom-right'
    };

    return {
      POSITION: POSITION,
      show: function (text, pos, action) {
        pos = pos || POSITION.BOTTOM_RIGHT;
        text = text || '';

        Snackbar.show({
          pos: pos,
          text: text,
          showAction: action
        });
      }
    };
  }
})();
