(function () {
  'use strict';

  angular.module('carTowingApp').factory('snackbar', service);

  service.$inject = ['$ionicPopup'];
  function service($ionicPopup) {
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
      },
      showError: function (err) {
        var message;

        if (err) {
          message = err.toString();

          // Durty hack
          if (message === '[object Object]') {
            message = '';
            if (err.data) {
              message += 'Object.data content';
              message += '<br/><br/>';
              message += JSON.stringify(err.data);
            } else {
              message += 'Object content';
              message += '<br/><br/>';
              message += JSON.stringify(err);
            }
          }

          message += '<br/><br/>';

          if (err.stack) {
            message += err.stack.toString();
          }
        } else {
          message = 'Something went wrong';
        }

        Snackbar.show({
          pos: POSITION.BOTTOM_RIGHT,
          text: 'Something went wrong',
          actionText: 'Details',
          onActionClick: function () {
            var modal = $ionicPopup.alert({
              title: 'Error message',
              template: message
            });
          }
        });
      }
    };
  }
})();
