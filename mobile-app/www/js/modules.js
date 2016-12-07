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

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService', '$cordovaCamera'];

  function DecalController($stateParams, DecalService, PropertiesService, $cordovaCamera) {
    var vm = this;
    vm.decalId = '';
    vm.decal = undefined;
    vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
    vm.title = vm.property.name || 'NO TITLE';
    vm.notFoundDecalError = '';

    vm.getDecalBySerialNumber = function () {
      DecalService.getDecalBySerialNumber(vm.serialNumber)
        .then(function (response) {
          if(response.status == 404) {
            vm.notFoundDecalError = response.data.message;
            vm.decal = undefined;
          } else {
            vm.notFoundDecalError = '';
            vm.decal = response.data;
            console.log(response);
          }
        }, function (error) {
          vm.decal = undefined;
          console.error(error);
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


        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
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
      getDecalBySerialNumber: getDecalBySerialNumber
    };

    function getDecalBySerialNumber(serialNumber) {
      return $http.get(config.url + "/api/decal-by-serial/" + serialNumber);
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
      PropertiesService.getProperties($stateParams.locationId);
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

    function getProperties(locationId) {
      $http.get(config.url + "/api/properties-by-location/" + locationId)
        .then(function (response) {
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

(function () {
  'use strict';

  angular.module('carTowingApp')
    .controller('LocationsController', LocationsController);

  LocationsController.$inject = ['LocationsService', '$stateParams', 'AuthService'];

  function LocationsController(LocationsService, $stateParams, AuthService) {
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgvYXV0aC5zZXJ2aWNlLmpzIiwiYXV0aC9sb2dpbi5jb250cm9sbGVyLmpzIiwiYXV0aC90b2tlbi5zZXJ2aWNlLmpzIiwiZGVjYWwvZGVjYWwuY29udHJvbGxlci5qcyIsImRlY2FsL2RlY2FsLnNlcnZpY2UuanMiLCJwaG90b3MvcGhvdG8uc2VydmljZS5qcyIsInBob3Rvcy9waG90b3MuY29udHJvbGxlci5qcyIsInByb3BlcnRpZXMvcHJvcGVydGllcy5jb250cm9sbGVyLmpzIiwicHJvcGVydGllcy9wcm9wZXJ0aWVzLmZpbHRlci5qcyIsInByb3BlcnRpZXMvcHJvcGVydGllcy5zZXJ2aWNlLmpzIiwibG9jYXRpb25zL2xvY2F0aW9ucy5jb250cm9sbGVyLmpzIiwibG9jYXRpb25zL2xvY2F0aW9ucy5zZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ1pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibW9kdWxlcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBBdXRoU2VydmljZSk7XG5cbiAgQXV0aFNlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBBdXRoU2VydmljZShjb25maWcsICRodHRwLCAkc3RhdGUsIFRva2VuU2VydmljZSkge1xuICAgIHJldHVybiB7XG4gICAgICBsb2dpbjogbG9naW4sXG4gICAgICBsb2dvdXQ6IGxvZ291dFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBsb2dpbih1c2VyKSB7XG4gICAgICByZXR1cm4gJGh0dHAucG9zdChjb25maWcudXJsICsgXCIvYXBpL2xvZ2luXCIsIHVzZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcbiAgICAgIFRva2VuU2VydmljZS5yZW1vdmVUb2tlbigpO1xuICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xuICAgIH1cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBMb2dpbkNvbnRyb2xsZXIpO1xuXG4gIExvZ2luQ29udHJvbGxlci4kaW5qZWN0ID0gWydBdXRoU2VydmljZScsICckc3RhdGUnLCAnVG9rZW5TZXJ2aWNlJywgJyRodHRwJ107XG5cbiAgZnVuY3Rpb24gTG9naW5Db250cm9sbGVyKEF1dGhTZXJ2aWNlLCAkc3RhdGUsIFRva2VuU2VydmljZSwgJGh0dHApIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0udXNlciA9IHtcbiAgICAgIGxvZ2luOiAnYWRtaW5AYWRtaW4uY29tJyxcbiAgICAgIHBhc3N3b3JkOiAnYWRtaW4nXG4gICAgfTtcbiAgICB2bS5lcnJvck1lcyA9IFwiXCI7XG5cbiAgICB2bS5zaWduSW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICBjb25zb2xlLmxvZyh2bS51c2VyKTtcbiAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKHZtLnVzZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChzdWNjZXNzKSB7XG4gICAgICAgICAgVG9rZW5TZXJ2aWNlLnNldFRva2VuKHN1Y2Nlc3MuZGF0YS50b2tlbiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ0FSVC1Ub2tlbiddID0gVG9rZW5TZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xvY2F0aW9ucycpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgICB2bS5lcnJvck1lcyA9IGVycm9yLmRhdGEubWVzc2FnZTtcbiAgICAgICAgfSk7XG5cbiAgICB9XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ1Rva2VuU2VydmljZScsIFRva2VuU2VydmljZSk7XG5cbiAgVG9rZW5TZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZyddO1xuXG4gIGZ1bmN0aW9uIFRva2VuU2VydmljZShjb25maWcpIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0VG9rZW5OYW1lOiBnZXRUb2tlbk5hbWUsXG4gICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICBzZXRUb2tlbjogc2V0VG9rZW4sXG4gICAgICByZW1vdmVUb2tlbjogcmVtb3ZlVG9rZW4sXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFRva2VuKCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5nZXRJdGVtKCdjYXJ0LicgKyBnZXRUb2tlbk5hbWUoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0VG9rZW4odG9rZW4sIGNhbGxiYWNrKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnY2FydC4nICsgZ2V0VG9rZW5OYW1lKCksIHRva2VuKTtcbiAgICAgIGNhbGxiYWNrKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVtb3ZlVG9rZW4oKSB7XG4gICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbk5hbWUoKSB7XG4gICAgICByZXR1cm4gY29uZmlnLnRva2VuTmFtZTtcbiAgICB9XG4gIH1cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0RlY2FsQ29udHJvbGxlcicsIERlY2FsQ29udHJvbGxlcik7XG5cbiAgRGVjYWxDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZVBhcmFtcycsICdEZWNhbFNlcnZpY2UnLCAnUHJvcGVydGllc1NlcnZpY2UnLCAnJGNvcmRvdmFDYW1lcmEnXTtcblxuICBmdW5jdGlvbiBEZWNhbENvbnRyb2xsZXIoJHN0YXRlUGFyYW1zLCBEZWNhbFNlcnZpY2UsIFByb3BlcnRpZXNTZXJ2aWNlLCAkY29yZG92YUNhbWVyYSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZGVjYWxJZCA9ICcnO1xuICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgIHZtLnByb3BlcnR5ID0gUHJvcGVydGllc1NlcnZpY2UuZ2V0UHJvcGVydHlCeUlkKCRzdGF0ZVBhcmFtcy5wcm9wZXJ0eUlkKTtcbiAgICB2bS50aXRsZSA9IHZtLnByb3BlcnR5Lm5hbWUgfHwgJ05PIFRJVExFJztcbiAgICB2bS5ub3RGb3VuZERlY2FsRXJyb3IgPSAnJztcblxuICAgIHZtLmdldERlY2FsQnlTZXJpYWxOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBEZWNhbFNlcnZpY2UuZ2V0RGVjYWxCeVNlcmlhbE51bWJlcih2bS5zZXJpYWxOdW1iZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgIHZtLm5vdEZvdW5kRGVjYWxFcnJvciA9IHJlc3BvbnNlLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5ub3RGb3VuZERlY2FsRXJyb3IgPSAnJztcbiAgICAgICAgICAgIHZtLmRlY2FsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdm0ub3BlbkNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvcGVuaW5nIGNhbWVyYScpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZXJlYWR5XCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBxdWFsaXR5OiA1MCxcbiAgICAgICAgICBkZXN0aW5hdGlvblR5cGU6IENhbWVyYS5EZXN0aW5hdGlvblR5cGUuREFUQV9VUkwsXG4gICAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgICBhbGxvd0VkaXQ6IHRydWUsXG4gICAgICAgICAgZW5jb2RpbmdUeXBlOiBDYW1lcmEuRW5jb2RpbmdUeXBlLkpQRUcsXG4gICAgICAgICAgdGFyZ2V0V2lkdGg6IDMwMCxcbiAgICAgICAgICB0YXJnZXRIZWlnaHQ6IDMwMCxcbiAgICAgICAgICBwb3BvdmVyT3B0aW9uczogQ2FtZXJhUG9wb3Zlck9wdGlvbnMsXG4gICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2UsXG4gICAgICAgICAgY29ycmVjdE9yaWVudGF0aW9uOiB0cnVlXG4gICAgICAgIH07XG5cblxuICAgICAgICAkY29yZG92YUNhbWVyYS5nZXRQaWN0dXJlKG9wdGlvbnMpXG4gICAgICAgICAgLnRoZW4oZnVuY3Rpb24gKGltYWdlRGF0YSkge1xuICAgICAgICAgIGFsZXJ0KGltYWdlRGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgICBhbGVydChlcnJvcik7XG4gICAgICAgIH0pO1xuXG4gICAgICB9LCBmYWxzZSk7XG4gICAgfVxuXG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmFjdG9yeSgnRGVjYWxTZXJ2aWNlJywgRGVjYWxTZXJ2aWNlKTtcblxuICBEZWNhbFNlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJ107XG5cbiAgZnVuY3Rpb24gRGVjYWxTZXJ2aWNlKGNvbmZpZywgJGh0dHApIHtcbiAgICByZXR1cm4ge1xuICAgICAgZ2V0RGVjYWxCeVNlcmlhbE51bWJlcjogZ2V0RGVjYWxCeVNlcmlhbE51bWJlclxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXREZWNhbEJ5U2VyaWFsTnVtYmVyKHNlcmlhbE51bWJlcikge1xuICAgICAgcmV0dXJuICRodHRwLmdldChjb25maWcudXJsICsgXCIvYXBpL2RlY2FsLWJ5LXNlcmlhbC9cIiArIHNlcmlhbE51bWJlcik7XG4gICAgfVxuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmFjdG9yeSgnUGhvdG9zU2VydmljZScsIFBob3Rvc1NlcnZpY2UpO1xuXG4gIFBob3Rvc1NlcnZpY2UuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFBob3Rvc1NlcnZpY2UoKSB7XG4gICAgcmV0dXJuIHt9XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Bob3Rvc0NvbnRyb2xsZXInLCBQaG90b3NDb250cm9sbGVyKTtcblxuICBQaG90b3NDb250cm9sbGVyLiRpbmplY3QgPSBbXTtcblxuICBmdW5jdGlvbiBQaG90b3NDb250cm9sbGVyKCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuY29udHJvbGxlcignUHJvcGVydGllc0NvbnRyb2xsZXInLCBQcm9wZXJ0aWVzQ29udHJvbGxlcik7XG5cbiAgUHJvcGVydGllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNQb3B1cCcsICdMb2NhdGlvbnNTZXJ2aWNlJywgJ1Byb3BlcnRpZXNTZXJ2aWNlJywgJyRzY29wZSddO1xuXG4gIGZ1bmN0aW9uIFByb3BlcnRpZXNDb250cm9sbGVyKCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkaW9uaWNQb3B1cCwgTG9jYXRpb25zU2VydmljZSwgUHJvcGVydGllc1NlcnZpY2UsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sb2NhdGlvbiA9IExvY2F0aW9uc1NlcnZpY2UuZ2V0TG9jYXRpb25CeUlkKCRzdGF0ZVBhcmFtcy5sb2NhdGlvbklkKTtcblxuICAgIHZtLnRpdGxlID0gdm0ubG9jYXRpb24gPyB2bS5sb2NhdGlvbi5uYW1lIDogXCJObyB0aXRsZVwiO1xuXG4gICAgdm0ucHJvcGVydGllcyA9IFByb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXM7XG4gICAgdm0uZ2V0UHJvcGVydGllcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIFByb3BlcnRpZXNTZXJ2aWNlLmdldFByb3BlcnRpZXMoJHN0YXRlUGFyYW1zLmxvY2F0aW9uSWQpO1xuICAgIH07XG5cbiAgICB2bS5zaG93Q29uZmlybSA9IGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgJHNjb3BlLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgICBjb25zb2xlLmxvZygkc2NvcGUucHJvcGVydHkpO1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByb3BlcnR5KTtcbiAgICAgIHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgdGl0bGU6ICdQbGVhc2UgY29uZmlybS4nLFxuICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICB0ZW1wbGF0ZTogJ0FyZSB5b3UgaW4ge3twcm9wZXJ0eS5uYW1lfX0/JyxcbiAgICAgICAgb2tUZXh0OiAnWWVzJyxcbiAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjYW5jZWxUZXh0OiAnTm8nLFxuICAgICAgICBjYW5jZWxUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjc3NDbGFzczogJ2N1c3RvbS1jb25mb3JtLXBvcHVwJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgICRzdGF0ZS5nbygnZGVjYWwnLCB7cHJvcGVydHlJZDogJHNjb3BlLnByb3BlcnR5Ll9pZH0pO1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIHN1cmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBub3Qgc3VyZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuXG4gICAgdm0uc2hvd0NvbmZpcm1SdWxlcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb25maXJtUG9wdXAgPSAkaW9uaWNQb3B1cC5jb25maXJtKHtcbiAgICAgICAgdGl0bGU6ICdSdWxlcyBoYXZlIGNoYW5nZWQuJyxcbiAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgcmV2aWV3IHRoZW0uJyxcbiAgICAgICAgb2tUZXh0OiAnT2snLFxuICAgICAgICBva1R5cGU6ICdidXR0b24tZGVmYXVsdCcsXG4gICAgICAgIGNhbmNlbFRleHQ6ICdMYXRlcicsXG4gICAgICAgIGNhbmNlbFR5cGU6ICdidXR0b24tZGVmYXVsdCcsXG4gICAgICAgIGNzc0NsYXNzOiAnY3VzdG9tLWNvbmZvcm0tcG9wdXAnXG4gICAgICB9KTtcblxuICAgICAgY29uZmlybVBvcHVwLnRoZW4oZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzKSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBzdXJlJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuZmlsdGVyKCdQcm9wZXJ0aWVzRmlsdGVyJywgUHJvcGVydGllc0ZpbHRlcik7XG5cbiAgUHJvcGVydGllc0ZpbHRlci4kaW5qZWN0ID0gW107XG5cbiAgZnVuY3Rpb24gUHJvcGVydGllc0ZpbHRlcigpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKHByb3BlcnRpZXMsIHF1ZXJ5LCBsb2NhdGlvbklkKSB7XG4gICAgICB2YXIgcHJvcGVydGllc0xpc3QgPSBbXTtcblxuICAgICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgICAvLyBUT0RPOiBkbyBtb3JlIGNoZWNraW5nXG4gICAgICAgIGlmICghcHJvcGVydHkuZGVsZXRlZCAvKiYmIGxvY2F0aW9uSWQgPT0gcHJvcGVydHkubG9jYXRpb24gKi8gJiYgY2hlY2tOYW1lKHByb3BlcnR5Lm5hbWUsIHF1ZXJ5KSkge1xuICAgICAgICAgIHByb3BlcnRpZXNMaXN0LnB1c2gocHJvcGVydHkpO1xuICAgICAgICB9XG5cblxuICAgICAgfSk7XG5cbiAgICAgIGZ1bmN0aW9uIGNoZWNrTmFtZShhbGxOYW1lLCBwYXJ0TmFtZSkge1xuICAgICAgICB2YXIgc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgaWYgKHBhcnROYW1lID09IHVuZGVmaW5lZCB8fCBwYXJ0TmFtZS5sZW5ndGggPT0gMCkgcmV0dXJuIHN0YXR1cztcblxuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhcnROYW1lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgaWYgKHBhcnROYW1lW2ldICE9IGFsbE5hbWVbaV0pIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc3RhdHVzO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gcHJvcGVydGllc0xpc3Q7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ1Byb3BlcnRpZXNTZXJ2aWNlJywgUHJvcGVydGllc1NlcnZpY2UpO1xuXG4gIFByb3BlcnRpZXNTZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZycsICckaHR0cCddO1xuXG4gIGZ1bmN0aW9uIFByb3BlcnRpZXNTZXJ2aWNlKGNvbmZpZywgJGh0dHApIHtcbiAgICB2YXIgcHJvcGVydGllcyA9IHtcbiAgICAgIGxpc3Q6IFtdXG4gICAgfTtcblxuICAgIHJldHVybiB7XG4gICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuICAgICAgZ2V0UHJvcGVydGllczogZ2V0UHJvcGVydGllcyxcbiAgICAgIGdldFByb3BlcnR5QnlJZDogZ2V0UHJvcGVydHlCeUlkXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldFByb3BlcnRpZXMobG9jYXRpb25JZCkge1xuICAgICAgJGh0dHAuZ2V0KGNvbmZpZy51cmwgKyBcIi9hcGkvcHJvcGVydGllcy1ieS1sb2NhdGlvbi9cIiArIGxvY2F0aW9uSWQpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIHByb3BlcnRpZXMubGlzdCA9IFtdLmNvbmNhdChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICBjb25zb2xlLmxvZyhwcm9wZXJ0aWVzKTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFByb3BlcnR5QnlJZChwcm9wZXJ0eUlkKSB7XG4gICAgICByZXR1cm4gcHJvcGVydGllcy5saXN0LmZpbmQoZnVuY3Rpb24gKHByb3BlcnkpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ3Byb3BlcnkuX2lkID09IHByb3BlcnR5SWQnICsgcHJvcGVyeS5faWQgKyAnICcgKyBwcm9wZXJ0eUlkKVxuICAgICAgICByZXR1cm4gcHJvcGVyeS5faWQgPT0gcHJvcGVydHlJZDtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5jb250cm9sbGVyKCdMb2NhdGlvbnNDb250cm9sbGVyJywgTG9jYXRpb25zQ29udHJvbGxlcik7XG5cbiAgTG9jYXRpb25zQ29udHJvbGxlci4kaW5qZWN0ID0gWydMb2NhdGlvbnNTZXJ2aWNlJywgJyRzdGF0ZVBhcmFtcycsICdBdXRoU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc0NvbnRyb2xsZXIoTG9jYXRpb25zU2VydmljZSwgJHN0YXRlUGFyYW1zLCBBdXRoU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sb2NhdGlvbnMgPSBMb2NhdGlvbnNTZXJ2aWNlLmxvY2F0aW9ucztcblxuICAgIHZtLmdldExvY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIExvY2F0aW9uc1NlcnZpY2UuZ2V0TG9jYXRpb25zKCk7XG4gICAgfTtcblxuICAgIHZtLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ0xvY2F0aW9uc1NlcnZpY2UnLCBMb2NhdGlvbnNTZXJ2aWNlKTtcblxuICBMb2NhdGlvbnNTZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZycsICckaHR0cCddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc1NlcnZpY2UoY29uZmlnLCAkaHR0cCkge1xuICAgIHZhciBsb2NhdGlvbnMgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICBnZXRMb2NhdGlvbnM6IGdldExvY2F0aW9ucyxcbiAgICAgIGdldExvY2F0aW9uQnlJZDogZ2V0TG9jYXRpb25CeUlkXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldExvY2F0aW9ucygpIHtcbiAgICAgICRodHRwLmdldChjb25maWcudXJsICsgXCIvYXBpL2xvY2F0aW9uc1wiKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgbG9jYXRpb25zLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbkJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbnMubGlzdC5maW5kKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uX2lkID09IGlkO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iXX0=
