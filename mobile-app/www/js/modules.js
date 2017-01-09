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
        .then(function(success) {
          console.log(success);
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

  DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService', '$cordovaCamera', 'PhotosService'];

  function DecalController($stateParams, DecalService, PropertiesService, $cordovaCamera, PhotosService) {
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
          destinationType: Camera.DestinationType.DATA_URL,
          sourceType: Camera.PictureSourceType.CAMERA,
          allowEdit: false,
          encodingType: Camera.EncodingType.JPEG,
          popoverOptions: CameraPopoverOptions,
          saveToPhotoAlbum: false
        };


        $cordovaCamera.getPicture(options)
          .then(function (imageData) {
            var d = new Date,
              dformat = [ (d.getMonth()+1).padLeft(),
                  d.getDate().padLeft(),
                  d.getFullYear()].join('/')+
                ' ' +
                [ d.getHours().padLeft(),
                  d.getMinutes().padLeft()].join(':');



            var data = "data:image/jpeg;base64," + imageData;

            var photoObj = {
              name: "No name",
              base64: data,
              date: dformat,
              sent: false,
              deleted: false
            };

            PhotosService.addPhoto(photoObj);
          }, function (err) {
            alert(err);
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
    .controller('PhotosController', PhotosController);

  PhotosController.$inject = ['PhotosService'];

  function PhotosController(PhotosService) {
    var vm = this;
    vm.photos = PhotosService.allPhotos.list;

    vm.getAllPhotos = function() {
      PhotosService.getPhotos();
    }
  }

})();

(function () {
  'use strict';
  angular.module('carTowingApp')
    .factory('PhotosService', PhotosService);

  PhotosService.$inject = ['DatabaseService'];

  function PhotosService(DatabaseService) {
    var allPhotos = {
      list: []
    };
    return {
      addPhoto: addPhoto,
      getPhotos: getPhotos,
      allPhotos: allPhotos
    }


    /* get all phrotos from local DB */
    function getPhotos() {
      DatabaseService.getAll(function(res) {
        console.log(res);
        alert(JSON.stringify(res));
      }, function(err) {
        console.error(err);
      });
    }

    /* get just not sent photos from local DB*/
    function getPhotosForSending() {

    }

    function addPhoto(photo) {
      alert('Photo service ' + JSON.stringify(photo));
      DatabaseService.addImage(photo, function(res) {
        alert('res ' + JSON.stringify(res));
      }, function(err) {
        alert('err ' + JSON.stringify(err));
      })
    }
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

  LocationsController.$inject = ['LocationsService', 'DatabaseService', 'AuthService', 'PhotosService'];

  function LocationsController(LocationsService, DatabaseService, AuthService, PhotosService) {
    var vm = this;

    vm.locations = LocationsService.locations;

    vm.getLocations = function () {
      LocationsService.getLocations();
    };

    vm.logout = function () {
      AuthService.logout();
    };

    vm.addPhotoTest = function () {

      var d = new Date,
        dformat = [ (d.getMonth()+1).padLeft(),
            d.getDate().padLeft(),
            d.getFullYear()].join('/')+
          ' ' +
          [ d.getHours().padLeft(),
            d.getMinutes().padLeft()].join(':');
      var data = "data:image/jpeg;base64," + 'test';

      var photoObj = {
        name: "No name for test",
        base64: data,
        date: dformat,
        sent: false,
        deleted: false
      };

      PhotosService.addPhoto(photoObj);
    };

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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGgvYXV0aC5zZXJ2aWNlLmpzIiwiYXV0aC9sb2dpbi5jb250cm9sbGVyLmpzIiwiYXV0aC90b2tlbi5zZXJ2aWNlLmpzIiwiZGVjYWwvZGVjYWwuY29udHJvbGxlci5qcyIsImRlY2FsL2RlY2FsLnNlcnZpY2UuanMiLCJwaG90b3MvcGhvdG9zLmNvbnRyb2xsZXIuanMiLCJwaG90b3MvcGhvdG9zLnNlcnZpY2UuanMiLCJwcm9wZXJ0aWVzL3Byb3BlcnRpZXMuY29udHJvbGxlci5qcyIsInByb3BlcnRpZXMvcHJvcGVydGllcy5maWx0ZXIuanMiLCJwcm9wZXJ0aWVzL3Byb3BlcnRpZXMuc2VydmljZS5qcyIsImxvY2F0aW9ucy9sb2NhdGlvbnMuY29udHJvbGxlci5qcyIsImxvY2F0aW9ucy9sb2NhdGlvbnMuc2VydmljZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtb2R1bGVzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdBdXRoU2VydmljZScsIEF1dGhTZXJ2aWNlKTtcblxuICBBdXRoU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnLCAnJGh0dHAnLCAnJHN0YXRlJywgJ1Rva2VuU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIEF1dGhTZXJ2aWNlKGNvbmZpZywgJGh0dHAsICRzdGF0ZSwgVG9rZW5TZXJ2aWNlKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGxvZ2luOiBsb2dpbixcbiAgICAgIGxvZ291dDogbG9nb3V0XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXIpIHtcbiAgICAgIHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZy51cmwgKyBcIi9hcGkvbG9naW5cIiwgdXNlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xuICAgICAgVG9rZW5TZXJ2aWNlLnJlbW92ZVRva2VuKCk7XG4gICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhclxuICAgIC5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIExvZ2luQ29udHJvbGxlcik7XG5cbiAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnLCAnJGh0dHAnXTtcblxuICBmdW5jdGlvbiBMb2dpbkNvbnRyb2xsZXIoQXV0aFNlcnZpY2UsICRzdGF0ZSwgVG9rZW5TZXJ2aWNlLCAkaHR0cCkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS51c2VyID0ge1xuICAgICAgbG9naW46ICdhZG1pbkBhZG1pbi5jb20nLFxuICAgICAgcGFzc3dvcmQ6ICdhZG1pbidcbiAgICB9O1xuICAgIHZtLmVycm9yTWVzID0gXCJcIjtcblxuICAgIHZtLnNpZ25JbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKHZtLnVzZXIpO1xuICAgICAgQXV0aFNlcnZpY2UubG9naW4odm0udXNlcilcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24oc3VjY2Vzcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHN1Y2Nlc3MpO1xuICAgICAgICAgIFRva2VuU2VydmljZS5zZXRUb2tlbihzdWNjZXNzLmRhdGEudG9rZW4sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLUNBUlQtVG9rZW4nXSA9IFRva2VuU2VydmljZS5nZXRUb2tlbigpO1xuICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2NhdGlvbnMnKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgICAgdm0uZXJyb3JNZXMgPSBlcnJvci5kYXRhLm1lc3NhZ2U7XG4gICAgICAgIH0pO1xuXG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGFuZ3VsYXJcbiAgICAubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdUb2tlblNlcnZpY2UnLCBUb2tlblNlcnZpY2UpO1xuXG4gIFRva2VuU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnXTtcblxuICBmdW5jdGlvbiBUb2tlblNlcnZpY2UoY29uZmlnKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldFRva2VuTmFtZTogZ2V0VG9rZW5OYW1lLFxuICAgICAgZ2V0VG9rZW46IGdldFRva2VuLFxuICAgICAgc2V0VG9rZW46IHNldFRva2VuLFxuICAgICAgcmVtb3ZlVG9rZW46IHJlbW92ZVRva2VuLFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRUb2tlbigpIHtcbiAgICAgIHJldHVybiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydC4nICsgZ2V0VG9rZW5OYW1lKCkpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpLCB0b2tlbik7XG4gICAgICBjYWxsYmFjaygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbW92ZVRva2VuKCkge1xuICAgICAgcmV0dXJuIGxvY2FsU3RvcmFnZS5yZW1vdmVJdGVtKCdjYXJ0LicgKyBnZXRUb2tlbk5hbWUoKSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VG9rZW5OYW1lKCkge1xuICAgICAgcmV0dXJuIGNvbmZpZy50b2tlbk5hbWU7XG4gICAgfVxuICB9XG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5jb250cm9sbGVyKCdEZWNhbENvbnRyb2xsZXInLCBEZWNhbENvbnRyb2xsZXIpO1xuXG4gIERlY2FsQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc3RhdGVQYXJhbXMnLCAnRGVjYWxTZXJ2aWNlJywgJ1Byb3BlcnRpZXNTZXJ2aWNlJywgJyRjb3Jkb3ZhQ2FtZXJhJywgJ1Bob3Rvc1NlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBEZWNhbENvbnRyb2xsZXIoJHN0YXRlUGFyYW1zLCBEZWNhbFNlcnZpY2UsIFByb3BlcnRpZXNTZXJ2aWNlLCAkY29yZG92YUNhbWVyYSwgUGhvdG9zU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZGVjYWxJZCA9ICcnO1xuICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgIHZtLnByb3BlcnR5ID0gUHJvcGVydGllc1NlcnZpY2UuZ2V0UHJvcGVydHlCeUlkKCRzdGF0ZVBhcmFtcy5wcm9wZXJ0eUlkKTtcbiAgICB2bS50aXRsZSA9IHZtLnByb3BlcnR5Lm5hbWUgfHwgJ05PIFRJVExFJztcbiAgICB2bS5ub3RGb3VuZERlY2FsRXJyb3IgPSAnJztcblxuICAgIHZtLmdldERlY2FsQnlTZXJpYWxOdW1iZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBEZWNhbFNlcnZpY2UuZ2V0RGVjYWxCeVNlcmlhbE51bWJlcih2bS5zZXJpYWxOdW1iZXIpXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xuICAgICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cyA9PSA0MDQpIHtcbiAgICAgICAgICAgIHZtLm5vdEZvdW5kRGVjYWxFcnJvciA9IHJlc3BvbnNlLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB2bS5ub3RGb3VuZERlY2FsRXJyb3IgPSAnJztcbiAgICAgICAgICAgIHZtLmRlY2FsID0gcmVzcG9uc2UuZGF0YTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIHZtLmRlY2FsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgdm0ub3BlbkNhbWVyYSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvcGVuaW5nIGNhbWVyYScpO1xuICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZXJlYWR5XCIsIGZ1bmN0aW9uICgpIHtcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICBkZXN0aW5hdGlvblR5cGU6IENhbWVyYS5EZXN0aW5hdGlvblR5cGUuREFUQV9VUkwsXG4gICAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgICBhbGxvd0VkaXQ6IGZhbHNlLFxuICAgICAgICAgIGVuY29kaW5nVHlwZTogQ2FtZXJhLkVuY29kaW5nVHlwZS5KUEVHLFxuICAgICAgICAgIHBvcG92ZXJPcHRpb25zOiBDYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgICBzYXZlVG9QaG90b0FsYnVtOiBmYWxzZVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgJGNvcmRvdmFDYW1lcmEuZ2V0UGljdHVyZShvcHRpb25zKVxuICAgICAgICAgIC50aGVuKGZ1bmN0aW9uIChpbWFnZURhdGEpIHtcbiAgICAgICAgICAgIHZhciBkID0gbmV3IERhdGUsXG4gICAgICAgICAgICAgIGRmb3JtYXQgPSBbIChkLmdldE1vbnRoKCkrMSkucGFkTGVmdCgpLFxuICAgICAgICAgICAgICAgICAgZC5nZXREYXRlKCkucGFkTGVmdCgpLFxuICAgICAgICAgICAgICAgICAgZC5nZXRGdWxsWWVhcigpXS5qb2luKCcvJykrXG4gICAgICAgICAgICAgICAgJyAnICtcbiAgICAgICAgICAgICAgICBbIGQuZ2V0SG91cnMoKS5wYWRMZWZ0KCksXG4gICAgICAgICAgICAgICAgICBkLmdldE1pbnV0ZXMoKS5wYWRMZWZ0KCldLmpvaW4oJzonKTtcblxuXG5cbiAgICAgICAgICAgIHZhciBkYXRhID0gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LFwiICsgaW1hZ2VEYXRhO1xuXG4gICAgICAgICAgICB2YXIgcGhvdG9PYmogPSB7XG4gICAgICAgICAgICAgIG5hbWU6IFwiTm8gbmFtZVwiLFxuICAgICAgICAgICAgICBiYXNlNjQ6IGRhdGEsXG4gICAgICAgICAgICAgIGRhdGU6IGRmb3JtYXQsXG4gICAgICAgICAgICAgIHNlbnQ6IGZhbHNlLFxuICAgICAgICAgICAgICBkZWxldGVkOiBmYWxzZVxuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgUGhvdG9zU2VydmljZS5hZGRQaG90byhwaG90b09iaik7XG4gICAgICAgICAgfSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgICAgYWxlcnQoZXJyKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgfSwgZmFsc2UpO1xuICAgIH1cblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ0RlY2FsU2VydmljZScsIERlY2FsU2VydmljZSk7XG5cbiAgRGVjYWxTZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZycsICckaHR0cCddO1xuXG4gIGZ1bmN0aW9uIERlY2FsU2VydmljZShjb25maWcsICRodHRwKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGdldERlY2FsQnlTZXJpYWxOdW1iZXI6IGdldERlY2FsQnlTZXJpYWxOdW1iZXJcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RGVjYWxCeVNlcmlhbE51bWJlcihzZXJpYWxOdW1iZXIpIHtcbiAgICAgIHJldHVybiAkaHR0cC5nZXQoY29uZmlnLnVybCArIFwiL2FwaS9kZWNhbC1ieS1zZXJpYWwvXCIgKyBzZXJpYWxOdW1iZXIpO1xuICAgIH1cbiAgfVxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Bob3Rvc0NvbnRyb2xsZXInLCBQaG90b3NDb250cm9sbGVyKTtcblxuICBQaG90b3NDb250cm9sbGVyLiRpbmplY3QgPSBbJ1Bob3Rvc1NlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBQaG90b3NDb250cm9sbGVyKFBob3Rvc1NlcnZpY2UpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLnBob3RvcyA9IFBob3Rvc1NlcnZpY2UuYWxsUGhvdG9zLmxpc3Q7XG5cbiAgICB2bS5nZXRBbGxQaG90b3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIFBob3Rvc1NlcnZpY2UuZ2V0UGhvdG9zKCk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdQaG90b3NTZXJ2aWNlJywgUGhvdG9zU2VydmljZSk7XG5cbiAgUGhvdG9zU2VydmljZS4kaW5qZWN0ID0gWydEYXRhYmFzZVNlcnZpY2UnXTtcblxuICBmdW5jdGlvbiBQaG90b3NTZXJ2aWNlKERhdGFiYXNlU2VydmljZSkge1xuICAgIHZhciBhbGxQaG90b3MgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG4gICAgcmV0dXJuIHtcbiAgICAgIGFkZFBob3RvOiBhZGRQaG90byxcbiAgICAgIGdldFBob3RvczogZ2V0UGhvdG9zLFxuICAgICAgYWxsUGhvdG9zOiBhbGxQaG90b3NcbiAgICB9XG5cblxuICAgIC8qIGdldCBhbGwgcGhyb3RvcyBmcm9tIGxvY2FsIERCICovXG4gICAgZnVuY3Rpb24gZ2V0UGhvdG9zKCkge1xuICAgICAgRGF0YWJhc2VTZXJ2aWNlLmdldEFsbChmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgYWxlcnQoSlNPTi5zdHJpbmdpZnkocmVzKSk7XG4gICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihlcnIpO1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyogZ2V0IGp1c3Qgbm90IHNlbnQgcGhvdG9zIGZyb20gbG9jYWwgREIqL1xuICAgIGZ1bmN0aW9uIGdldFBob3Rvc0ZvclNlbmRpbmcoKSB7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBhZGRQaG90byhwaG90bykge1xuICAgICAgYWxlcnQoJ1Bob3RvIHNlcnZpY2UgJyArIEpTT04uc3RyaW5naWZ5KHBob3RvKSk7XG4gICAgICBEYXRhYmFzZVNlcnZpY2UuYWRkSW1hZ2UocGhvdG8sIGZ1bmN0aW9uKHJlcykge1xuICAgICAgICBhbGVydCgncmVzICcgKyBKU09OLnN0cmluZ2lmeShyZXMpKTtcbiAgICAgIH0sIGZ1bmN0aW9uKGVycikge1xuICAgICAgICBhbGVydCgnZXJyICcgKyBKU09OLnN0cmluZ2lmeShlcnIpKTtcbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb3BlcnRpZXNDb250cm9sbGVyJywgUHJvcGVydGllc0NvbnRyb2xsZXIpO1xuXG4gIFByb3BlcnRpZXNDb250cm9sbGVyLiRpbmplY3QgPSBbJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnJGlvbmljUG9wdXAnLCAnTG9jYXRpb25zU2VydmljZScsICdQcm9wZXJ0aWVzU2VydmljZScsICckc2NvcGUnXTtcblxuICBmdW5jdGlvbiBQcm9wZXJ0aWVzQ29udHJvbGxlcigkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGlvbmljUG9wdXAsIExvY2F0aW9uc1NlcnZpY2UsIFByb3BlcnRpZXNTZXJ2aWNlLCAkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuXG4gICAgdm0ubG9jYXRpb24gPSBMb2NhdGlvbnNTZXJ2aWNlLmdldExvY2F0aW9uQnlJZCgkc3RhdGVQYXJhbXMubG9jYXRpb25JZCk7XG5cbiAgICB2bS50aXRsZSA9IHZtLmxvY2F0aW9uID8gdm0ubG9jYXRpb24ubmFtZSA6IFwiTm8gdGl0bGVcIjtcblxuICAgIHZtLnByb3BlcnRpZXMgPSBQcm9wZXJ0aWVzU2VydmljZS5wcm9wZXJ0aWVzO1xuICAgIHZtLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICBQcm9wZXJ0aWVzU2VydmljZS5nZXRQcm9wZXJ0aWVzKCRzdGF0ZVBhcmFtcy5sb2NhdGlvbklkKTtcbiAgICB9O1xuXG4gICAgdm0uc2hvd0NvbmZpcm0gPSBmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICRzY29wZS5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgICAgY29uc29sZS5sb2coJHNjb3BlLnByb3BlcnR5KTtcbiAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5wcm9wZXJ0eSk7XG4gICAgICB2YXIgY29uZmlybVBvcHVwID0gJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgIHRpdGxlOiAnUGxlYXNlIGNvbmZpcm0uJyxcbiAgICAgICAgc2NvcGU6ICRzY29wZSxcbiAgICAgICAgdGVtcGxhdGU6ICdBcmUgeW91IGluIHt7cHJvcGVydHkubmFtZX19PycsXG4gICAgICAgIG9rVGV4dDogJ1llcycsXG4gICAgICAgIG9rVHlwZTogJ2J1dHRvbi1kZWZhdWx0JyxcbiAgICAgICAgY2FuY2VsVGV4dDogJ05vJyxcbiAgICAgICAgY2FuY2VsVHlwZTogJ2J1dHRvbi1kZWZhdWx0JyxcbiAgICAgICAgY3NzQ2xhc3M6ICdjdXN0b20tY29uZm9ybS1wb3B1cCdcbiAgICAgIH0pO1xuXG4gICAgICBjb25maXJtUG9wdXAudGhlbihmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAkc3RhdGUuZ28oJ2RlY2FsJywge3Byb3BlcnR5SWQ6ICRzY29wZS5wcm9wZXJ0eS5faWR9KTtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBzdXJlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgbm90IHN1cmUnKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfTtcblxuICAgIHZtLnNob3dDb25maXJtUnVsZXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29uZmlybVBvcHVwID0gJGlvbmljUG9wdXAuY29uZmlybSh7XG4gICAgICAgIHRpdGxlOiAnUnVsZXMgaGF2ZSBjaGFuZ2VkLicsXG4gICAgICAgIHRlbXBsYXRlOiAnUGxlYXNlIHJldmlldyB0aGVtLicsXG4gICAgICAgIG9rVGV4dDogJ09rJyxcbiAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjYW5jZWxUZXh0OiAnTGF0ZXInLFxuICAgICAgICBjYW5jZWxUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICBjc3NDbGFzczogJ2N1c3RvbS1jb25mb3JtLXBvcHVwJ1xuICAgICAgfSk7XG5cbiAgICAgIGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgaWYgKHJlcykge1xuICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIHN1cmUnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygnWW91IGFyZSBub3Qgc3VyZScpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9O1xuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZpbHRlcignUHJvcGVydGllc0ZpbHRlcicsIFByb3BlcnRpZXNGaWx0ZXIpO1xuXG4gIFByb3BlcnRpZXNGaWx0ZXIuJGluamVjdCA9IFtdO1xuXG4gIGZ1bmN0aW9uIFByb3BlcnRpZXNGaWx0ZXIoKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChwcm9wZXJ0aWVzLCBxdWVyeSwgbG9jYXRpb25JZCkge1xuICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG5cbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbiAocHJvcGVydHkpIHtcbiAgICAgICAgLy8gVE9ETzogZG8gbW9yZSBjaGVja2luZ1xuICAgICAgICBpZiAoIXByb3BlcnR5LmRlbGV0ZWQgLyomJiBsb2NhdGlvbklkID09IHByb3BlcnR5LmxvY2F0aW9uICovICYmIGNoZWNrTmFtZShwcm9wZXJ0eS5uYW1lLCBxdWVyeSkpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzTGlzdC5wdXNoKHByb3BlcnR5KTtcbiAgICAgICAgfVxuXG5cbiAgICAgIH0pO1xuXG4gICAgICBmdW5jdGlvbiBjaGVja05hbWUoYWxsTmFtZSwgcGFydE5hbWUpIHtcbiAgICAgICAgdmFyIHN0YXR1cyA9IHRydWU7XG4gICAgICAgIGlmIChwYXJ0TmFtZSA9PSB1bmRlZmluZWQgfHwgcGFydE5hbWUubGVuZ3RoID09IDApIHJldHVybiBzdGF0dXM7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0TmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChwYXJ0TmFtZVtpXSAhPSBhbGxOYW1lW2ldKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHByb3BlcnRpZXNMaXN0O1xuICAgIH1cbiAgfVxuXG59KSgpO1xuIiwiKGZ1bmN0aW9uICgpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgIC5mYWN0b3J5KCdQcm9wZXJ0aWVzU2VydmljZScsIFByb3BlcnRpZXNTZXJ2aWNlKTtcblxuICBQcm9wZXJ0aWVzU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnLCAnJGh0dHAnXTtcblxuICBmdW5jdGlvbiBQcm9wZXJ0aWVzU2VydmljZShjb25maWcsICRodHRwKSB7XG4gICAgdmFyIHByb3BlcnRpZXMgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgcHJvcGVydGllczogcHJvcGVydGllcyxcbiAgICAgIGdldFByb3BlcnRpZXM6IGdldFByb3BlcnRpZXMsXG4gICAgICBnZXRQcm9wZXJ0eUJ5SWQ6IGdldFByb3BlcnR5QnlJZFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKGxvY2F0aW9uSWQpIHtcbiAgICAgICRodHRwLmdldChjb25maWcudXJsICsgXCIvYXBpL3Byb3BlcnRpZXMtYnktbG9jYXRpb24vXCIgKyBsb2NhdGlvbklkKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBwcm9wZXJ0aWVzLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgY29uc29sZS5sb2cocHJvcGVydGllcyk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0eUJ5SWQocHJvcGVydHlJZCkge1xuICAgICAgcmV0dXJuIHByb3BlcnRpZXMubGlzdC5maW5kKGZ1bmN0aW9uIChwcm9wZXJ5KSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdwcm9wZXJ5Ll9pZCA9PSBwcm9wZXJ0eUlkJyArIHByb3BlcnkuX2lkICsgJyAnICsgcHJvcGVydHlJZClcbiAgICAgICAgcmV0dXJuIHByb3BlcnkuX2lkID09IHByb3BlcnR5SWQ7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxufSkoKTtcbiIsIihmdW5jdGlvbiAoKSB7XG4gICd1c2Ugc3RyaWN0JztcblxuICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAuY29udHJvbGxlcignTG9jYXRpb25zQ29udHJvbGxlcicsIExvY2F0aW9uc0NvbnRyb2xsZXIpO1xuXG4gIExvY2F0aW9uc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnTG9jYXRpb25zU2VydmljZScsICdEYXRhYmFzZVNlcnZpY2UnLCAnQXV0aFNlcnZpY2UnLCAnUGhvdG9zU2VydmljZSddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc0NvbnRyb2xsZXIoTG9jYXRpb25zU2VydmljZSwgRGF0YWJhc2VTZXJ2aWNlLCBBdXRoU2VydmljZSwgUGhvdG9zU2VydmljZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICB2bS5sb2NhdGlvbnMgPSBMb2NhdGlvbnNTZXJ2aWNlLmxvY2F0aW9ucztcblxuICAgIHZtLmdldExvY2F0aW9ucyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIExvY2F0aW9uc1NlcnZpY2UuZ2V0TG9jYXRpb25zKCk7XG4gICAgfTtcblxuICAgIHZtLmxvZ291dCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIEF1dGhTZXJ2aWNlLmxvZ291dCgpO1xuICAgIH07XG5cbiAgICB2bS5hZGRQaG90b1Rlc3QgPSBmdW5jdGlvbiAoKSB7XG5cbiAgICAgIHZhciBkID0gbmV3IERhdGUsXG4gICAgICAgIGRmb3JtYXQgPSBbIChkLmdldE1vbnRoKCkrMSkucGFkTGVmdCgpLFxuICAgICAgICAgICAgZC5nZXREYXRlKCkucGFkTGVmdCgpLFxuICAgICAgICAgICAgZC5nZXRGdWxsWWVhcigpXS5qb2luKCcvJykrXG4gICAgICAgICAgJyAnICtcbiAgICAgICAgICBbIGQuZ2V0SG91cnMoKS5wYWRMZWZ0KCksXG4gICAgICAgICAgICBkLmdldE1pbnV0ZXMoKS5wYWRMZWZ0KCldLmpvaW4oJzonKTtcbiAgICAgIHZhciBkYXRhID0gXCJkYXRhOmltYWdlL2pwZWc7YmFzZTY0LFwiICsgJ3Rlc3QnO1xuXG4gICAgICB2YXIgcGhvdG9PYmogPSB7XG4gICAgICAgIG5hbWU6IFwiTm8gbmFtZSBmb3IgdGVzdFwiLFxuICAgICAgICBiYXNlNjQ6IGRhdGEsXG4gICAgICAgIGRhdGU6IGRmb3JtYXQsXG4gICAgICAgIHNlbnQ6IGZhbHNlLFxuICAgICAgICBkZWxldGVkOiBmYWxzZVxuICAgICAgfTtcblxuICAgICAgUGhvdG9zU2VydmljZS5hZGRQaG90byhwaG90b09iaik7XG4gICAgfTtcblxuICB9XG5cbn0pKCk7XG4iLCIoZnVuY3Rpb24gKCkge1xuICAndXNlIHN0cmljdCc7XG5cbiAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgLmZhY3RvcnkoJ0xvY2F0aW9uc1NlcnZpY2UnLCBMb2NhdGlvbnNTZXJ2aWNlKTtcblxuICBMb2NhdGlvbnNTZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZycsICckaHR0cCddO1xuXG4gIGZ1bmN0aW9uIExvY2F0aW9uc1NlcnZpY2UoY29uZmlnLCAkaHR0cCkge1xuICAgIHZhciBsb2NhdGlvbnMgPSB7XG4gICAgICBsaXN0OiBbXVxuICAgIH07XG5cbiAgICByZXR1cm4ge1xuICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICBnZXRMb2NhdGlvbnM6IGdldExvY2F0aW9ucyxcbiAgICAgIGdldExvY2F0aW9uQnlJZDogZ2V0TG9jYXRpb25CeUlkXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldExvY2F0aW9ucygpIHtcbiAgICAgICRodHRwLmdldChjb25maWcudXJsICsgXCIvYXBpL2xvY2F0aW9uc1wiKVxuICAgICAgICAudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgbG9jYXRpb25zLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRMb2NhdGlvbkJ5SWQoaWQpIHtcbiAgICAgIHJldHVybiBsb2NhdGlvbnMubGlzdC5maW5kKGZ1bmN0aW9uIChsb2NhdGlvbikge1xuICAgICAgICByZXR1cm4gbG9jYXRpb24uX2lkID09IGlkO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbn0pKCk7XG4iXX0=
