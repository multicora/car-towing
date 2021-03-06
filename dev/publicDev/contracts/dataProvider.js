'use strict';

(function (angular) {
  var app = angular.module('app');

  service.$inject = ['$http', 'TokenService'];
  function service ($http, TokenService) {
    return {
      activate: function(propertyId, term, activationDate) {
        var date = new Date();
        var notifyTerm;

        date.setMonth(date.getMonth() - 1);

        notifyTerm = Date.now() - date.getTime();
        activationDate = activationDate.getTime();

        return $http.post('/api/contract', {
          property: propertyId,
          term: term,
          activationDate: activationDate,
          notifyTerm: notifyTerm
        }, {
          headers: {
            Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
          }
        });
      },
      getAll: function() {
        return $http.get('/api/contracts', {
          headers: {
            Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
          }
        });
      },
      getByProperty: function(id) {
        return $http.get('/api/contracts/' + id, {
          headers: {
            Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
          }
        });
      },
      getTerms: function () {
        return [
          {
            text: 'Not Expire',
            value: (function () {
              return null;
            })()
          },
          {
            text: '1 month',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 1);
              return date.getTime() - Date.now();
            })()
          },
          {
            text: '2 month',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 2);
              return date.getTime() - Date.now();
            })()
          },
          {
            text: '3 month',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 3);
              return date.getTime() - Date.now();
            })()
          },
          {
            text: '6 month',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 6);
              return date.getTime() - Date.now();
            })()
          },
          {
            text: '1 year',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 12);
              return date.getTime() - Date.now();
            })()
          },
          {
            text: '2 year',
            value: (function () {
              var date = new Date();
              date.setMonth(date.getMonth() + 24);
              return date.getTime() - Date.now();
            })()
          }
        ];
      },
      check: function (propId) {
        return $http.get(
          '/api/check-contract/' + propId,
          {
            headers: {
              Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
            }
          }
        );
      },
      checkTime: function (propId) {
        return $http.get(
          '/api/contracts-time/' + propId,
          {
            headers: {
              Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
            }
          }
        );
      },
      deactivate: function(id) {
        return $http.delete('/api/contract/' + id, {
          headers: {
            Authorization: TokenService.getTokenName() + ' ' + TokenService.getToken()
          }
        });
      },
    };
  }

  app.factory('contractsService', service);
})(angular);