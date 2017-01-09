(function () {
  'use strict';
  angular.module('carTowingApp')
    .factory('ConnectionService', ConnectionService);

  ConnectionService.$inject = [];

  function ConnectionService() {
    return {
      isWiFi: isWiFi
    };

    function getConnectionType(callback) {
      document.addEventListener("deviceready", function () {
        var networkState = navigator.connection.type;
        alert('deviceready ' + JSON.stringify(networkState));
        var states = {};
        states[Connection.UNKNOWN] = 'UNKNOWN';
        states[Connection.ETHERNET] = 'ETHERNET';
        states[Connection.WIFI] = 'WIFI';
        states[Connection.CELL_2G] = 'CELL_2G';
        states[Connection.CELL_3G] = 'CELL_3G';
        states[Connection.CELL_4G] = 'CELL_4G';
        states[Connection.CELL] = 'CELL';
        states[Connection.NONE] = 'NONE';

        alert('Connection type: ' + states[networkState]);
        callback(states[networkState]);
      });
    }

    function isWiFi() {
      return getConnectionType(function(type) {
          return type  == 'WIFI';
        });
    }
  }

})();
