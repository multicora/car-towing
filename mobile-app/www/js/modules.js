(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('AuthService', AuthService);

  AuthService.$inject = ['config', '$http', '$state', 'TokenService'];

  function AuthService(config, $http, $state, TokenService) {
    return {
      login: login,
      logout: logout
    };

    function login(user) {
      return $http.post(config.url + "/api/login", user);
    }

    function logout() {
      TokenService.removeToken();
      $state.go('login');
    }
  }

})();

(function () {
  'use strict';

  angular
    .module('carTowingApp')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['AuthService', '$state', 'TokenService', '$http'];

  function LoginController(AuthService, $state, TokenService, $http) {
    var vm = this;

    vm.user = {
      login: 'admin@admin.com',
      password: 'admin'
    };
    vm.errorMes = "";

    vm.signIn = function () {
      console.log(vm.user);
      AuthService.login(vm.user)
        .then(function (success) {
          TokenService.setToken(success.data.token, function () {
            $http.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
            $state.go('locations');
          });
        }, function (error) {
          vm.errorMes = error.data.message;
        });

    }
  }

})();

(function () {
  'use strict';
  angular
    .module('carTowingApp')
    .factory('TokenService', TokenService);

  TokenService.$inject = ['config'];

  function TokenService(config) {
    return {
      getTokenName: getTokenName,
      getToken: getToken,
      setToken: setToken,
      removeToken: removeToken,
    };

    function getToken() {
      return localStorage.getItem('cart.' + getTokenName());
    }

    function setToken(token, callback) {
      localStorage.setItem('cart.' + getTokenName(), token);
      callback();
    }

    function removeToken() {
      return localStorage.removeItem('cart.' + getTokenName());
    }

    function getTokenName() {
      return config.tokenName;
    }
  }
})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('DecalController', DecalController);

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService'];

  function DecalController($stateParams, DecalService, PropertiesService) {
    var vm = this;
    vm.decalId = '';
    vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
    console.log(vm.property);
    vm.title = vm.property.name || 'NO TITLE';

    vm.getDecalById = function () {
      console.log('ckick');
      DecalService.getDecalById(vm.decalId)
        .then(function (response) {
          console.log(response);
        }, function (error) {
          console.log(error);
        });
    };

    vm.openCamera = function () {
      console.log('opening camera');
      document.addEventListener("deviceready", function () {

        var options = {
          quality: 50,
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: true,
          encodingType: Camera.EncodingType.JPEG,
          targetWidth: 300,
          targetHeight: 300,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false,
          correctOrientation: true
        };


        $cordovaCamera.getPicture(options).then(function (imageData) {
          alert(imageData);
        }, function (err) {
          alert(error);
        });

      }, false);
    }

  }

})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('DecalService', DecalService);

  DecalService.$inject = ['config', '$http'];

  function DecalService(config, $http) {
    return {
      getDecalById: getDecalById
    };

    function getDecalById(decalId) {
      return $http.get(config.url + "/api/decal/" + decalId);
    }
  }
})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', '$stateParams', '$cordovaCamera', 'AuthService'];

  function LocationsController(LocationsService, $stateParams, $cordovaCamera, AuthService) {
    var vm = this;

    vm.locations = LocationsService.locations;

    vm.getLocations = function () {
      LocationsService.getLocations();
    };

    vm.logout = function () {
      AuthService.logout();
    }

  }

})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('LocationsService', LocationsService);

  LocationsService.$inject = ['config', '$http'];

  function LocationsService(config, $http) {
    var locations = {
      list: []
    };

    return {
      locations: locations,
      getLocations: getLocations,
      getLocationById: getLocationById
    };

    function getLocations() {
      $http.get(config.url + "/api/locations")
        .then(function (response) {
          console.log(response);
          locations.list = [].concat(response.data);
        }, function (error) {
          console.error(error);
        });
    }

    function getLocationById(id) {
      return locations.list.find(function (location) {
        return location._id == id;
      });
    }
  }

})();

(function () {
  'use strict';
  angular.module('carTowingApp')
    .factory('PhotosService', PhotosService);

  PhotosService.$inject = [];

  function PhotosService() {
    return {}
  }

})();

(function () {
  'use strict';
  angular.module('carTowingApp')
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = [];

  function PhotosController() {
    var vm = this;
  }

})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('PropertiesController', PropertiesController);

  PropertiesController.$inject = ['$state', '$stateParams', '$ionicPopup', 'LocationsService', 'PropertiesService', '$scope'];

  function PropertiesController($state, $stateParams, $ionicPopup, LocationsService, PropertiesService, $scope) {
    var vm = this;

    vm.location = LocationsService.getLocationById($stateParams.locationId);

    vm.title = vm.location ? vm.location.name : "No title";

    vm.properties = PropertiesService.properties;
    vm.getProperties = function () {
      PropertiesService.getProperties();
    };

    vm.showConfirm = function (property) {
      $scope.property = property;
      console.log($scope.property);
      console.log($scope.property);
      var confirmPopup = $ionicPopup.confirm({
        title: 'Please confirm.',
        scope: $scope,
        template: 'Are you in {{property.name}}?',
        okText: 'Yes',
        okType: 'button-default',
        cancelText: 'No',
        cancelType: 'button-default',
        cssClass: 'custom-conform-popup'
      });

      confirmPopup.then(function (res) {
        if (res) {
          $state.go('decal', {propertyId: $scope.property._id});
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };

    vm.showConfirmRules = function () {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Rules have changed.',
        template: 'Please review them.',
        okText: 'Ok',
        okType: 'button-default',
        cancelText: 'Later',
        cancelType: 'button-default',
        cssClass: 'custom-conform-popup'
      });

      confirmPopup.then(function (res) {
        if (res) {
          console.log('You are sure');
        } else {
          console.log('You are not sure');
        }
      });
    };
  }

})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .filter('PropertiesFilter', PropertiesFilter);

  PropertiesFilter.$inject = [];

  function PropertiesFilter() {
    return function (properties, query, locationId) {
      var propertiesList = [];

      properties.forEach(function (property) {
        // TODO: do more checking
        if (!property.deleted /*&& locationId == property.location */ && checkName(property.name, query)) {
          propertiesList.push(property);
        }


      });

      function checkName(allName, partName) {
        var status = true;
        if (partName == undefined || partName.length == 0) return status;

        for (var i = 0; i < partName.length; i++) {
          if (partName[i] != allName[i]) {
            return false;
          }
        }

        return status;
      }

      return propertiesList;
    }
  }

})();

(function () {
  'use strict';

  angular.module('carTowingApp')
    .factory('PropertiesService', PropertiesService);

  PropertiesService.$inject = ['config', '$http'];

  function PropertiesService(config, $http) {
    var properties = {
      list: []
    };

    return {
      properties: properties,
      getProperties: getProperties,
      getPropertyById: getPropertyById
    };

    function getProperties() {
      $http.get(config.url + "/api/properties")
        .then(function (response) {
          console.log(response)
          properties.list = [].concat(response.data);
          console.log(properties);
        }, function (error) {
          console.error(error);
        });
    }

    function getPropertyById(propertyId) {
      return properties.list.find(function (propery) {
        console.log('propery._id == propertyId' + propery._id + ' ' + propertyId)
        return propery._id == propertyId;
      });
    }
  }

})();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZSk7XG5cbiAgQXV0aFNlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBBdXRoU2VydmljZShjb25maWcsICRodHRwLCAkc3RhdGUsIFRva2VuU2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dpbjogbG9naW4sXG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2dpbih1c2VyKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChjb25maWcudXJsICsgXCIvYXBpL2xvZ2luXCIsIHVzZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgIFRva2VuU2VydmljZS5yZW1vdmVUb2tlbigpO1xuICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cbiAgfVxuXG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XG5cbiAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnLCAnJGh0dHAnXTtcblxuICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoQXV0aFNlcnZpY2UsICRzdGF0ZSwgVG9rZW5TZXJ2aWNlLCAkaHR0cCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS51c2VyID0ge1xuICAgICAgbG9naW46ICdhZG1pbkBhZG1pbi5jb20nLFxuICAgICAgcGFzc3dvcmQ6ICdhZG1pbidcbiAgICB9O1xuICAgIHZtLmVycm9yTWVzID0gXCJcIjtcblxuICAgIHZtLnNpZ25JbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKHZtLnVzZXIpO1xuICAgICAgQXV0aFNlcnZpY2UubG9naW4odm0udXNlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24gKHN1Y2Nlc3MpIHtcbiAgICAgICAgICBUb2tlblNlcnZpY2Uuc2V0VG9rZW4oc3VjY2Vzcy5kYXRhLnRva2VuLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1DQVJULVRva2VuJ10gPSBUb2tlblNlcnZpY2UuZ2V0VG9rZW4oKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbG9jYXRpb25zJyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIHZtLmVycm9yTWVzID0gZXJyb3IuZGF0YS5tZXNzYWdlO1xuICAgICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdUb2tlblNlcnZpY2UnLCBUb2tlblNlcnZpY2UpO1xuXG4gIFRva2VuU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnXTtcblxuICBmdW5jdGlvbiBUb2tlblNlcnZpY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFRva2VuTmFtZTogZ2V0VG9rZW5OYW1lLFxuICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgc2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgcmVtb3ZlVG9rZW46IHJlbW92ZVRva2VuLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydC4nICsgZ2V0VG9rZW5OYW1lKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpLCB0b2tlbik7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVRva2VuKCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjYXJ0LicgKyBnZXRUb2tlbk5hbWUoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW5OYW1lKCkge1xuICAgICAgcmV0dXJuIGNvbmZpZy50b2tlbk5hbWU7XG4gICAgfVxuICB9XG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0RlY2FsQ29udHJvbGxlcicsIERlY2FsQ29udHJvbGxlcik7XG5cbiAgRGVjYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZVBhcmFtcycsICdEZWNhbFNlcnZpY2UnLCAnUHJvcGVydGllc1NlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBEZWNhbENvbnRyb2xsZXIoJHN0YXRlUGFyYW1zLCBEZWNhbFNlcnZpY2UsIFByb3BlcnRpZXNTZXJ2aWNlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5kZWNhbElkID0gJyc7XG4gICAgdm0ucHJvcGVydHkgPSBQcm9wZXJ0aWVzU2VydmljZS5nZXRQcm9wZXJ0eUJ5SWQoJHN0YXRlUGFyYW1zLnByb3BlcnR5SWQpO1xuICAgIGNvbnNvbGUubG9nKHZtLnByb3BlcnR5KTtcbiAgICB2bS50aXRsZSA9IHZtLnByb3BlcnR5Lm5hbWUgfHwgJ05PIFRJVExFJztcblxuICAgIHZtLmdldERlY2FsQnlJZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdja2ljaycpO1xuICAgICAgRGVjYWxTZXJ2aWNlLmdldERlY2FsQnlJZCh2bS5kZWNhbElkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZtLm9wZW5DYW1lcmEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZygnb3BlbmluZyBjYW1lcmEnKTtcbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VyZWFkeVwiLCBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgcXVhbGl0eTogNTAsXG4gICAgICAgICAgZGVzdGluYXRpb25UeXBlOiBDYW1lcmEuRGVzdGluYXRpb25UeXBlLkRBVEFfVVJMLFxuICAgICAgICAgIHNvdXJjZVR5cGU6IENhbWVyYS5QaWN0dXJlU291cmNlVHlwZS5DQU1FUkEsXG4gICAgICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICAgIHRhcmdldFdpZHRoOiAzMDAsXG4gICAgICAgICAgdGFyZ2V0SGVpZ2h0OiAzMDAsXG4gICAgICAgICAgcG9wb3Zlck9wdGlvbnM6IENhbWVyYVBvcG92ZXJPcHRpb25zLFxuICAgICAgICAgIHNhdmVUb1Bob3RvQWxidW06IGZhbHNlLFxuICAgICAgICAgIGNvcnJlY3RPcmllbnRhdGlvbjogdHJ1ZVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKS50aGVuKGZ1bmN0aW9uIChpbWFnZURhdGEpIHtcbiAgICAgICAgICBhbGVydChpbWFnZURhdGEpO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgYWxlcnQoZXJyb3IpO1xuICAgICAgICB9KTtcblxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmFjdG9yeSgnRGVjYWxTZXJ2aWNlJywgRGVjYWxTZXJ2aWNlKTtcblxuICBEZWNhbFNlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJ107XG5cbiAgZnVuY3Rpb24gRGVjYWxTZXJ2aWNlKGNvbmZpZywgJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0RGVjYWxCeUlkOiBnZXREZWNhbEJ5SWRcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RGVjYWxCeUlkKGRlY2FsSWQpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoY29uZmlnLnVybCArIFwiL2FwaS9kZWNhbC9cIiArIGRlY2FsSWQpO1xuICAgIH1cbiAgfVxufSkoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5jb250cm9sbGVyKCdMb2NhdGlvbnNDb250cm9sbGVyJywgTG9jYXRpb25zQ29udHJvbGxlcik7XG5cbiAgTG9jYXRpb25zQ29udHJvbGxlci4kaW5qZWN0ID0gWydMb2NhdGlvbnNTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICckY29yZG92YUNhbWVyYScsICdBdXRoU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc0NvbnRyb2xsZXIoTG9jYXRpb25zU2VydmljZSwgJHN0YXRlUGFyYW1zLCAkY29yZG92YUNhbWVyYSwgQXV0aFNlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubG9jYXRpb25zID0gTG9jYXRpb25zU2VydmljZS5sb2NhdGlvbnM7XG5cbiAgICB2bS5nZXRMb2NhdGlvbnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBMb2NhdGlvbnNTZXJ2aWNlLmdldExvY2F0aW9ucygpO1xuICAgIH07XG5cbiAgICB2bS5sb2dvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBBdXRoU2VydmljZS5sb2dvdXQoKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuXG4oZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ0xvY2F0aW9uc1NlcnZpY2UnLCBMb2NhdGlvbnNTZXJ2aWNlKTtcblxuICBMb2NhdGlvbnNTZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZycsICckaHR0cCddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc1NlcnZpY2UoY29uZmlnLCAkaHR0cCkge1xuICAgIHZhciBsb2NhdGlvbnMgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICBnZXRMb2NhdGlvbnM6IGdldExvY2F0aW9ucyxcbiAgICAgIGdldExvY2F0aW9uQnlJZDogZ2V0TG9jYXRpb25CeUlkXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldExvY2F0aW9ucygpIHtcbiAgICAgICRodHRwLmdldChjb25maWcudXJsICsgXCIvYXBpL2xvY2F0aW9uc1wiKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgbG9jYXRpb25zLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbkJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbnMubGlzdC5maW5kKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uX2lkID09IGlkO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ1Bob3Rvc1NlcnZpY2UnLCBQaG90b3NTZXJ2aWNlKTtcblxuICBQaG90b3NTZXJ2aWNlLiRpbmplY3QgPSBbXTtcblxuICBmdW5jdGlvbiBQaG90b3NTZXJ2aWNlKCkge1xuICAgIHJldHVybiB7fVxuICB9XG5cbn0pKCk7XG5cbihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Bob3Rvc0NvbnRyb2xsZXInLCBQaG90b3NDb250cm9sbGVyKTtcblxuICBQaG90b3NDb250cm9sbGVyLiRpbmplY3QgPSBbXTtcblxuICBmdW5jdGlvbiBQaG90b3NDb250cm9sbGVyKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gIH1cblxufSkoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5jb250cm9sbGVyKCdQcm9wZXJ0aWVzQ29udHJvbGxlcicsIFByb3BlcnRpZXNDb250cm9sbGVyKTtcblxuICBQcm9wZXJ0aWVzQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpb25pY1BvcHVwJywgJ0xvY2F0aW9uc1NlcnZpY2UnLCAnUHJvcGVydGllc1NlcnZpY2UnLCAnJHNjb3BlJ107XG5cbiAgZnVuY3Rpb24gUHJvcGVydGllc0NvbnRyb2xsZXIoJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY1BvcHVwLCBMb2NhdGlvbnNTZXJ2aWNlLCBQcm9wZXJ0aWVzU2VydmljZSwgJHNjb3BlKSB7XG4gICAgdmFyIHZtID0gdGhpcztcblxuICAgIHZtLmxvY2F0aW9uID0gTG9jYXRpb25zU2VydmljZS5nZXRMb2NhdGlvbkJ5SWQoJHN0YXRlUGFyYW1zLmxvY2F0aW9uSWQpO1xuXG4gICAgdm0udGl0bGUgPSB2bS5sb2NhdGlvbiA/IHZtLmxvY2F0aW9uLm5hbWUgOiBcIk5vIHRpdGxlXCI7XG5cbiAgICB2bS5wcm9wZXJ0aWVzID0gUHJvcGVydGllc1NlcnZpY2UucHJvcGVydGllcztcbiAgICB2bS5nZXRQcm9wZXJ0aWVzID0gZnVuY3Rpb24gKCkge1xuICAgICAgUHJvcGVydGllc1NlcnZpY2UuZ2V0UHJvcGVydGllcygpO1xuICAgIH07XG5cbiAgICB2bS5zaG93Q29uZmlybSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgJHNjb3BlLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUucHJvcGVydHkpO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByb3BlcnR5KTtcbiAgICAgIHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgdGl0bGU6ICdQbGVhc2UgY29uZmlybS4nLFxuICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICB0ZW1wbGF0ZTogJ0FyZSB5b3UgaW4ge3twcm9wZXJ0eS5uYW1lfX0/JyxcbiAgICAgICAgb2tUZXh0OiAnWWVzJyxcbiAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjYW5jZWxUZXh0OiAnTm8nLFxuICAgICAgICBjYW5jZWxUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjc3NDbGFzczogJ2N1c3RvbS1jb25mb3JtLXBvcHVwJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICRzdGF0ZS5nbygnZGVjYWwnLCB7cHJvcGVydHlJZDogJHNjb3BlLnByb3BlcnR5Ll9pZH0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIHN1cmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBub3Qgc3VyZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdm0uc2hvd0NvbmZpcm1SdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgdGl0bGU6ICdSdWxlcyBoYXZlIGNoYW5nZWQuJyxcbiAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgcmV2aWV3IHRoZW0uJyxcbiAgICAgICAgb2tUZXh0OiAnT2snLFxuICAgICAgICBva1R5cGU6ICdidXR0b24tZGVmYXVsdCcsXG4gICAgICAgIGNhbmNlbFRleHQ6ICdMYXRlcicsXG4gICAgICAgIGNhbmNlbFR5cGU6ICdidXR0b24tZGVmYXVsdCcsXG4gICAgICAgIGNzc0NsYXNzOiAnY3VzdG9tLWNvbmZvcm0tcG9wdXAnXG4gICAgICB9KTtcblxuICAgICAgY29uZmlybVBvcHVwLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBzdXJlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxufSkoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5maWx0ZXIoJ1Byb3BlcnRpZXNGaWx0ZXInLCBQcm9wZXJ0aWVzRmlsdGVyKTtcblxuICBQcm9wZXJ0aWVzRmlsdGVyLiRpbmplY3QgPSBbXTtcblxuICBmdW5jdGlvbiBQcm9wZXJ0aWVzRmlsdGVyKCkge1xuICAgIHJldHVybiBmdW5jdGlvbiAocHJvcGVydGllcywgcXVlcnksIGxvY2F0aW9uSWQpIHtcbiAgICAgIHZhciBwcm9wZXJ0aWVzTGlzdCA9IFtdO1xuXG4gICAgICBwcm9wZXJ0aWVzLmZvckVhY2goZnVuY3Rpb24gKHByb3BlcnR5KSB7XG4gICAgICAgIC8vIFRPRE86IGRvIG1vcmUgY2hlY2tpbmdcbiAgICAgICAgaWYgKCFwcm9wZXJ0eS5kZWxldGVkIC8qJiYgbG9jYXRpb25JZCA9PSBwcm9wZXJ0eS5sb2NhdGlvbiAqLyAmJiBjaGVja05hbWUocHJvcGVydHkubmFtZSwgcXVlcnkpKSB7XG4gICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgIH1cblxuXG4gICAgICB9KTtcblxuICAgICAgZnVuY3Rpb24gY2hlY2tOYW1lKGFsbE5hbWUsIHBhcnROYW1lKSB7XG4gICAgICAgIHZhciBzdGF0dXMgPSB0cnVlO1xuICAgICAgICBpZiAocGFydE5hbWUgPT0gdW5kZWZpbmVkIHx8IHBhcnROYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gc3RhdHVzO1xuXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFydE5hbWUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICBpZiAocGFydE5hbWVbaV0gIT0gYWxsTmFtZVtpXSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzdGF0dXM7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwcm9wZXJ0aWVzTGlzdDtcbiAgICB9XG4gIH1cblxufSkoKTtcblxuKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdQcm9wZXJ0aWVzU2VydmljZScsIFByb3BlcnRpZXNTZXJ2aWNlKTtcblxuICBQcm9wZXJ0aWVzU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnLCAnJGh0dHAnXTtcblxuICBmdW5jdGlvbiBQcm9wZXJ0aWVzU2VydmljZShjb25maWcsICRodHRwKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgIGdldFByb3BlcnRpZXM6IGdldFByb3BlcnRpZXMsXG4gICAgICBnZXRQcm9wZXJ0eUJ5SWQ6IGdldFByb3BlcnR5QnlJZFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKCkge1xuICAgICAgJGh0dHAuZ2V0KGNvbmZpZy51cmwgKyBcIi9hcGkvcHJvcGVydGllc1wiKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSlcbiAgICAgICAgICBwcm9wZXJ0aWVzLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgY29uc29sZS5sb2cocHJvcGVydGllcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0eUJ5SWQocHJvcGVydHlJZCkge1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGlzdC5maW5kKGZ1bmN0aW9uIChwcm9wZXJ5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcm9wZXJ5Ll9pZCA9PSBwcm9wZXJ0eUlkJyArIHByb3BlcnkuX2lkICsgJyAnICsgcHJvcGVydHlJZClcbiAgICAgICAgcmV0dXJuIHByb3BlcnkuX2lkID09IHByb3BlcnR5SWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufSkoKTtcbiJdLCJmaWxlIjoibW9kdWxlcy5qcyJ9
