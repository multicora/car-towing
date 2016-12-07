(function() {
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
(function() {
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

        vm.signIn = function() {
            console.log(vm.user);
            AuthService.login(vm.user)
                .then(function(success) {
                    TokenService.setToken(success.data.token, function() {
                        $http.defaults.headers.common['X-CART-Token'] = TokenService.getToken();
                        $state.go('locations');
                    });
                }, function(error) {
                    vm.errorMes = error.data.message;
                });

        }
    }

})();
(function() {
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
            console.log(JSON.stringify(localStorage.getItem('cart.' + getTokenName())));
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
(function() {
    'use strict';

    angular.module('carTowingApp')
        .controller('DecalController', DecalController);

    DecalController.$inject = ['$stateParams', 'DecalService', 'PropertiesService'];

    function DecalController($stateParams, DecalService, PropertiesService) {
        var vm = this;
        vm.decalId = '';
        vm.property = PropertiesService.getPropertyById($stateParams.propertyId);
        console.log( vm.property);
        vm.title = vm.property.name || 'NO TITLE';

        vm.getDecalById = function() {
            console.log('ckick');
            DecalService.getDecalById(vm.decalId)
                .then(function(response) {
                    console.log(response);
                }, function(error) {
                    console.log(error);
                });
        }

        vm.openCamera = function() {
            console.log('opening camera');
            document.addEventListener("deviceready", function() {

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


                $cordovaCamera.getPicture(options).then(function(imageData) {
                    alert(imageData);
                }, function(err) {
                    console.error(error);
                });

            }, false);
        }

    }

})();
(function() {
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
(function() {
    'use strict';

    angular.module('carTowingApp')
        .controller('LocationsController', LocationsController);

    LocationsController.$inject = ['LocationsService', '$stateParams', '$cordovaCamera', 'AuthService'];

    function LocationsController(LocationsService, $stateParams, $cordovaCamera, AuthService) {
        var vm = this;

        vm.locations = LocationsService.locations;

        vm.getLocations = function() {
            LocationsService.getLocations();
        };

        vm.logout = function() {
            AuthService.logout();
        }

    }

})();
(function() {
    'use strict';

    angular.module('carTowingApp')
        .factory('LocationsService', LocationsService);

    LocationsService.$inject = ['config', '$http'];

    function LocationsService(config, $http) {
        var locations = {
            list: []
        }

        return {
            locations: locations,
            getLocations: getLocations,
            getLocationById: getLocationById
        };

        function getLocations() {
            $http.get(config.url + "/api/locations")
                .then(function(response) {
                    console.log(response);
                    locations.list = [].concat(response.data);
                }, function(error) {
                    console.error(error);
                });
        }

        function getLocationById(id) {
            return locations.list.find(function(location) {
                return location._id == id;
            });
        }
    }

})();
(function() {
    'use strict';
    angular.module('carTowingApp')
        .factory('PhotosService', PhotosService);

    PhotosService.$inject = [];

    function PhotosService() {
        return {

        }
    }

})();
(function() {
    'use strict';
    angular.module('carTowingApp')
        .controller('PhotosController', PhotosController);

    PhotosController.$inject = [];

    function PhotosController() {
        var vm = this;
    }

})();
(function() {
    'use strict';

    angular.module('carTowingApp')
        .controller('PropertiesController', PropertiesController);

    PropertiesController.$inject = ['$state', '$stateParams', '$ionicPopup', 'LocationsService', 'PropertiesService', '$scope'];

    function PropertiesController($state, $stateParams, $ionicPopup, LocationsService, PropertiesService, $scope) {
        var vm = this;

        vm.location = LocationsService.getLocationById($stateParams.locationId);

        vm.title = vm.location ? vm.location.name : "No title";

        vm.properties = PropertiesService.properties;
        vm.getProperties = function() {
            PropertiesService.getProperties();
        };

        vm.showConfirm = function(property) {
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

            confirmPopup.then(function(res) {
                if (res) {
                    $state.go('decal', { propertyId: $scope.property._id });
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };

        vm.showConfirmRules = function() {
            var confirmPopup = $ionicPopup.confirm({
                title: 'Rules have changed.',
                template: 'Please review them.',
                okText: 'Ok',
                okType: 'button-default',
                cancelText: 'Later',
                cancelType: 'button-default',
                cssClass: 'custom-conform-popup'
            });

            confirmPopup.then(function(res) {
                if (res) {
                    console.log('You are sure');
                } else {
                    console.log('You are not sure');
                }
            });
        };
    }

})();
(function() {
    'use strict';

    angular.module('carTowingApp')
        .filter('PropertiesFilter', PropertiesFilter);

    PropertiesFilter.$inject = [];

    function PropertiesFilter() {
        return function(properties, query, locationId) {
            var propertiesList = [];

            properties.forEach(function(property) {
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
(function() {
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
        }

        function getProperties() {
            $http.get(config.url + "/api/properties")
                .then(function(response) {
                    console.log(response)
                    properties.list = [].concat(response.data);
                    console.log(properties);
                }, function(error) {
                    console.error(error);
                });;
        }

        function getPropertyById(propertyId) {
            return properties.list.find(function(propery) {
                console.log('propery._id == propertyId' + propery._id + ' ' + propertyId)
                return propery._id == propertyId;
            })
        }
    }

})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb2R1bGVzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0F1dGhTZXJ2aWNlJywgQXV0aFNlcnZpY2UpO1xuXG4gICAgQXV0aFNlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnXTtcblxuICAgIGZ1bmN0aW9uIEF1dGhTZXJ2aWNlKGNvbmZpZywgJGh0dHAsICRzdGF0ZSwgVG9rZW5TZXJ2aWNlKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBsb2dpbjogbG9naW4sXG4gICAgICAgICAgICBsb2dvdXQ6IGxvZ291dFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGxvZ2luKHVzZXIpIHtcbiAgICAgICAgICAgIHJldHVybiAkaHR0cC5wb3N0KGNvbmZpZy51cmwgKyBcIi9hcGkvbG9naW5cIiwgdXNlcik7XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XG4gICAgICAgICAgICBUb2tlblNlcnZpY2UucmVtb3ZlVG9rZW4oKTtcbiAgICAgICAgICAgICRzdGF0ZS5nbygnbG9naW4nKTtcbiAgICAgICAgfVxuICAgIH1cblxufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2dpbkNvbnRyb2xsZXInLCBMb2dpbkNvbnRyb2xsZXIpO1xuXG4gICAgTG9naW5Db250cm9sbGVyLiRpbmplY3QgPSBbJ0F1dGhTZXJ2aWNlJywgJyRzdGF0ZScsICdUb2tlblNlcnZpY2UnLCAnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIExvZ2luQ29udHJvbGxlcihBdXRoU2VydmljZSwgJHN0YXRlLCBUb2tlblNlcnZpY2UsICRodHRwKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0udXNlciA9IHtcbiAgICAgICAgICAgIGxvZ2luOiAnYWRtaW5AYWRtaW4uY29tJyxcbiAgICAgICAgICAgIHBhc3N3b3JkOiAnYWRtaW4nXG4gICAgICAgIH07XG4gICAgICAgIHZtLmVycm9yTWVzID0gXCJcIjtcblxuICAgICAgICB2bS5zaWduSW4gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHZtLnVzZXIpO1xuICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9naW4odm0udXNlcilcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihzdWNjZXNzKSB7XG4gICAgICAgICAgICAgICAgICAgIFRva2VuU2VydmljZS5zZXRUb2tlbihzdWNjZXNzLmRhdGEudG9rZW4sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtQ0FSVC1Ub2tlbiddID0gVG9rZW5TZXJ2aWNlLmdldFRva2VuKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ2xvY2F0aW9ucycpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICB2bS5lcnJvck1lcyA9IGVycm9yLmRhdGEubWVzc2FnZTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICBhbmd1bGFyXG4gICAgICAgIC5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgICAgIC5mYWN0b3J5KCdUb2tlblNlcnZpY2UnLCBUb2tlblNlcnZpY2UpO1xuXG4gICAgVG9rZW5TZXJ2aWNlLiRpbmplY3QgPSBbJ2NvbmZpZyddO1xuXG4gICAgZnVuY3Rpb24gVG9rZW5TZXJ2aWNlKGNvbmZpZykge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZ2V0VG9rZW5OYW1lOiBnZXRUb2tlbk5hbWUsXG4gICAgICAgICAgICBnZXRUb2tlbjogZ2V0VG9rZW4sXG4gICAgICAgICAgICBzZXRUb2tlbjogc2V0VG9rZW4sXG4gICAgICAgICAgICByZW1vdmVUb2tlbjogcmVtb3ZlVG9rZW4sXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0VG9rZW4oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhKU09OLnN0cmluZ2lmeShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnY2FydC4nICsgZ2V0VG9rZW5OYW1lKCkpKSk7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHNldFRva2VuKHRva2VuLCBjYWxsYmFjaykge1xuICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpLCB0b2tlbik7XG4gICAgICAgICAgICBjYWxsYmFjaygpO1xuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gcmVtb3ZlVG9rZW4oKSB7XG4gICAgICAgICAgICByZXR1cm4gbG9jYWxTdG9yYWdlLnJlbW92ZUl0ZW0oJ2NhcnQuJyArIGdldFRva2VuTmFtZSgpKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFRva2VuTmFtZSgpIHtcbiAgICAgICAgICAgIHJldHVybiBjb25maWcudG9rZW5OYW1lO1xuICAgICAgICB9XG4gICAgfVxufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ0RlY2FsQ29udHJvbGxlcicsIERlY2FsQ29udHJvbGxlcik7XG5cbiAgICBEZWNhbENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHN0YXRlUGFyYW1zJywgJ0RlY2FsU2VydmljZScsICdQcm9wZXJ0aWVzU2VydmljZSddO1xuXG4gICAgZnVuY3Rpb24gRGVjYWxDb250cm9sbGVyKCRzdGF0ZVBhcmFtcywgRGVjYWxTZXJ2aWNlLCBQcm9wZXJ0aWVzU2VydmljZSkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgICAgICB2bS5kZWNhbElkID0gJyc7XG4gICAgICAgIHZtLnByb3BlcnR5ID0gUHJvcGVydGllc1NlcnZpY2UuZ2V0UHJvcGVydHlCeUlkKCRzdGF0ZVBhcmFtcy5wcm9wZXJ0eUlkKTtcbiAgICAgICAgY29uc29sZS5sb2coIHZtLnByb3BlcnR5KTtcbiAgICAgICAgdm0udGl0bGUgPSB2bS5wcm9wZXJ0eS5uYW1lIHx8ICdOTyBUSVRMRSc7XG5cbiAgICAgICAgdm0uZ2V0RGVjYWxCeUlkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnY2tpY2snKTtcbiAgICAgICAgICAgIERlY2FsU2VydmljZS5nZXREZWNhbEJ5SWQodm0uZGVjYWxJZClcbiAgICAgICAgICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oZXJyb3IpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgdm0ub3BlbkNhbWVyYSA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ29wZW5pbmcgY2FtZXJhJyk7XG4gICAgICAgICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlcmVhZHlcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgcXVhbGl0eTogNTAsXG4gICAgICAgICAgICAgICAgICAgIGRlc3RpbmF0aW9uVHlwZTogQ2FtZXJhLkRlc3RpbmF0aW9uVHlwZS5EQVRBX1VSTCxcbiAgICAgICAgICAgICAgICAgICAgc291cmNlVHlwZTogQ2FtZXJhLlBpY3R1cmVTb3VyY2VUeXBlLkNBTUVSQSxcbiAgICAgICAgICAgICAgICAgICAgYWxsb3dFZGl0OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBlbmNvZGluZ1R5cGU6IENhbWVyYS5FbmNvZGluZ1R5cGUuSlBFRyxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0V2lkdGg6IDMwMCxcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0SGVpZ2h0OiAzMDAsXG4gICAgICAgICAgICAgICAgICAgIHBvcG92ZXJPcHRpb25zOiBDYW1lcmFQb3BvdmVyT3B0aW9ucyxcbiAgICAgICAgICAgICAgICAgICAgc2F2ZVRvUGhvdG9BbGJ1bTogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIGNvcnJlY3RPcmllbnRhdGlvbjogdHJ1ZVxuICAgICAgICAgICAgICAgIH07XG5cblxuICAgICAgICAgICAgICAgICRjb3Jkb3ZhQ2FtZXJhLmdldFBpY3R1cmUob3B0aW9ucykudGhlbihmdW5jdGlvbihpbWFnZURhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoaW1hZ2VEYXRhKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH0sIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnRGVjYWxTZXJ2aWNlJywgRGVjYWxTZXJ2aWNlKTtcblxuICAgIERlY2FsU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnLCAnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIERlY2FsU2VydmljZShjb25maWcsICRodHRwKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBnZXREZWNhbEJ5SWQ6IGdldERlY2FsQnlJZFxuICAgICAgICB9O1xuXG4gICAgICAgIGZ1bmN0aW9uIGdldERlY2FsQnlJZChkZWNhbElkKSB7XG4gICAgICAgICAgICByZXR1cm4gJGh0dHAuZ2V0KGNvbmZpZy51cmwgKyBcIi9hcGkvZGVjYWwvXCIgKyBkZWNhbElkKTtcbiAgICAgICAgfVxuICAgIH1cbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgYW5ndWxhci5tb2R1bGUoJ2NhclRvd2luZ0FwcCcpXG4gICAgICAgIC5jb250cm9sbGVyKCdMb2NhdGlvbnNDb250cm9sbGVyJywgTG9jYXRpb25zQ29udHJvbGxlcik7XG5cbiAgICBMb2NhdGlvbnNDb250cm9sbGVyLiRpbmplY3QgPSBbJ0xvY2F0aW9uc1NlcnZpY2UnLCAnJHN0YXRlUGFyYW1zJywgJyRjb3Jkb3ZhQ2FtZXJhJywgJ0F1dGhTZXJ2aWNlJ107XG5cbiAgICBmdW5jdGlvbiBMb2NhdGlvbnNDb250cm9sbGVyKExvY2F0aW9uc1NlcnZpY2UsICRzdGF0ZVBhcmFtcywgJGNvcmRvdmFDYW1lcmEsIEF1dGhTZXJ2aWNlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubG9jYXRpb25zID0gTG9jYXRpb25zU2VydmljZS5sb2NhdGlvbnM7XG5cbiAgICAgICAgdm0uZ2V0TG9jYXRpb25zID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBMb2NhdGlvbnNTZXJ2aWNlLmdldExvY2F0aW9ucygpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHZtLmxvZ291dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgQXV0aFNlcnZpY2UubG9nb3V0KCk7XG4gICAgICAgIH1cblxuICAgIH1cblxufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAgICAgLmZhY3RvcnkoJ0xvY2F0aW9uc1NlcnZpY2UnLCBMb2NhdGlvbnNTZXJ2aWNlKTtcblxuICAgIExvY2F0aW9uc1NlcnZpY2UuJGluamVjdCA9IFsnY29uZmlnJywgJyRodHRwJ107XG5cbiAgICBmdW5jdGlvbiBMb2NhdGlvbnNTZXJ2aWNlKGNvbmZpZywgJGh0dHApIHtcbiAgICAgICAgdmFyIGxvY2F0aW9ucyA9IHtcbiAgICAgICAgICAgIGxpc3Q6IFtdXG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgbG9jYXRpb25zOiBsb2NhdGlvbnMsXG4gICAgICAgICAgICBnZXRMb2NhdGlvbnM6IGdldExvY2F0aW9ucyxcbiAgICAgICAgICAgIGdldExvY2F0aW9uQnlJZDogZ2V0TG9jYXRpb25CeUlkXG4gICAgICAgIH07XG5cbiAgICAgICAgZnVuY3Rpb24gZ2V0TG9jYXRpb25zKCkge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KGNvbmZpZy51cmwgKyBcIi9hcGkvbG9jYXRpb25zXCIpXG4gICAgICAgICAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbnMubGlzdCA9IFtdLmNvbmNhdChyZXNwb25zZS5kYXRhKTtcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihlcnJvcikge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldExvY2F0aW9uQnlJZChpZCkge1xuICAgICAgICAgICAgcmV0dXJuIGxvY2F0aW9ucy5saXN0LmZpbmQoZnVuY3Rpb24obG9jYXRpb24pIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbG9jYXRpb24uX2lkID09IGlkO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnUGhvdG9zU2VydmljZScsIFBob3Rvc1NlcnZpY2UpO1xuXG4gICAgUGhvdG9zU2VydmljZS4kaW5qZWN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBQaG90b3NTZXJ2aWNlKCkge1xuICAgICAgICByZXR1cm4ge1xuXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7XG4oZnVuY3Rpb24oKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgICAgICAuY29udHJvbGxlcignUGhvdG9zQ29udHJvbGxlcicsIFBob3Rvc0NvbnRyb2xsZXIpO1xuXG4gICAgUGhvdG9zQ29udHJvbGxlci4kaW5qZWN0ID0gW107XG5cbiAgICBmdW5jdGlvbiBQaG90b3NDb250cm9sbGVyKCkge1xuICAgICAgICB2YXIgdm0gPSB0aGlzO1xuICAgIH1cblxufSkoKTtcbihmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICBhbmd1bGFyLm1vZHVsZSgnY2FyVG93aW5nQXBwJylcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Byb3BlcnRpZXNDb250cm9sbGVyJywgUHJvcGVydGllc0NvbnRyb2xsZXIpO1xuXG4gICAgUHJvcGVydGllc0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICckaW9uaWNQb3B1cCcsICdMb2NhdGlvbnNTZXJ2aWNlJywgJ1Byb3BlcnRpZXNTZXJ2aWNlJywgJyRzY29wZSddO1xuXG4gICAgZnVuY3Rpb24gUHJvcGVydGllc0NvbnRyb2xsZXIoJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRpb25pY1BvcHVwLCBMb2NhdGlvbnNTZXJ2aWNlLCBQcm9wZXJ0aWVzU2VydmljZSwgJHNjb3BlKSB7XG4gICAgICAgIHZhciB2bSA9IHRoaXM7XG5cbiAgICAgICAgdm0ubG9jYXRpb24gPSBMb2NhdGlvbnNTZXJ2aWNlLmdldExvY2F0aW9uQnlJZCgkc3RhdGVQYXJhbXMubG9jYXRpb25JZCk7XG5cbiAgICAgICAgdm0udGl0bGUgPSB2bS5sb2NhdGlvbiA/IHZtLmxvY2F0aW9uLm5hbWUgOiBcIk5vIHRpdGxlXCI7XG5cbiAgICAgICAgdm0ucHJvcGVydGllcyA9IFByb3BlcnRpZXNTZXJ2aWNlLnByb3BlcnRpZXM7XG4gICAgICAgIHZtLmdldFByb3BlcnRpZXMgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIFByb3BlcnRpZXNTZXJ2aWNlLmdldFByb3BlcnRpZXMoKTtcbiAgICAgICAgfTtcblxuICAgICAgICB2bS5zaG93Q29uZmlybSA9IGZ1bmN0aW9uKHByb3BlcnR5KSB7XG4gICAgICAgICAgICAkc2NvcGUucHJvcGVydHkgPSBwcm9wZXJ0eTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5wcm9wZXJ0eSk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUucHJvcGVydHkpO1xuICAgICAgICAgICAgdmFyIGNvbmZpcm1Qb3B1cCA9ICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUGxlYXNlIGNvbmZpcm0uJyxcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLFxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnQXJlIHlvdSBpbiB7e3Byb3BlcnR5Lm5hbWV9fT8nLFxuICAgICAgICAgICAgICAgIG9rVGV4dDogJ1llcycsXG4gICAgICAgICAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICdObycsXG4gICAgICAgICAgICAgICAgY2FuY2VsVHlwZTogJ2J1dHRvbi1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2N1c3RvbS1jb25mb3JtLXBvcHVwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKCdkZWNhbCcsIHsgcHJvcGVydHlJZDogJHNjb3BlLnByb3BlcnR5Ll9pZCB9KTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBzdXJlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdm0uc2hvd0NvbmZpcm1SdWxlcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIGNvbmZpcm1Qb3B1cCA9ICRpb25pY1BvcHVwLmNvbmZpcm0oe1xuICAgICAgICAgICAgICAgIHRpdGxlOiAnUnVsZXMgaGF2ZSBjaGFuZ2VkLicsXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICdQbGVhc2UgcmV2aWV3IHRoZW0uJyxcbiAgICAgICAgICAgICAgICBva1RleHQ6ICdPaycsXG4gICAgICAgICAgICAgICAgb2tUeXBlOiAnYnV0dG9uLWRlZmF1bHQnLFxuICAgICAgICAgICAgICAgIGNhbmNlbFRleHQ6ICdMYXRlcicsXG4gICAgICAgICAgICAgICAgY2FuY2VsVHlwZTogJ2J1dHRvbi1kZWZhdWx0JyxcbiAgICAgICAgICAgICAgICBjc3NDbGFzczogJ2N1c3RvbS1jb25mb3JtLXBvcHVwJ1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGNvbmZpcm1Qb3B1cC50aGVuKGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGlmIChyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1lvdSBhcmUgc3VyZScpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdZb3UgYXJlIG5vdCBzdXJlJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH07XG4gICAgfVxuXG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgICAgICAuZmlsdGVyKCdQcm9wZXJ0aWVzRmlsdGVyJywgUHJvcGVydGllc0ZpbHRlcik7XG5cbiAgICBQcm9wZXJ0aWVzRmlsdGVyLiRpbmplY3QgPSBbXTtcblxuICAgIGZ1bmN0aW9uIFByb3BlcnRpZXNGaWx0ZXIoKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbihwcm9wZXJ0aWVzLCBxdWVyeSwgbG9jYXRpb25JZCkge1xuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXNMaXN0ID0gW107XG5cbiAgICAgICAgICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICAgIC8vIFRPRE86IGRvIG1vcmUgY2hlY2tpbmdcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5LmRlbGV0ZWQgLyomJiBsb2NhdGlvbklkID09IHByb3BlcnR5LmxvY2F0aW9uICovICYmIGNoZWNrTmFtZShwcm9wZXJ0eS5uYW1lLCBxdWVyeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydGllc0xpc3QucHVzaChwcm9wZXJ0eSk7XG4gICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBmdW5jdGlvbiBjaGVja05hbWUoYWxsTmFtZSwgcGFydE5hbWUpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3RhdHVzID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBpZiAocGFydE5hbWUgPT0gdW5kZWZpbmVkIHx8IHBhcnROYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gc3RhdHVzO1xuXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYXJ0TmFtZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAocGFydE5hbWVbaV0gIT0gYWxsTmFtZVtpXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXR1cztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXNMaXN0O1xuICAgICAgICB9XG4gICAgfVxuXG59KSgpO1xuKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIGFuZ3VsYXIubW9kdWxlKCdjYXJUb3dpbmdBcHAnKVxuICAgICAgICAuZmFjdG9yeSgnUHJvcGVydGllc1NlcnZpY2UnLCBQcm9wZXJ0aWVzU2VydmljZSk7XG5cbiAgICBQcm9wZXJ0aWVzU2VydmljZS4kaW5qZWN0ID0gWydjb25maWcnLCAnJGh0dHAnXTtcblxuICAgIGZ1bmN0aW9uIFByb3BlcnRpZXNTZXJ2aWNlKGNvbmZpZywgJGh0dHApIHtcbiAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB7XG4gICAgICAgICAgICBsaXN0OiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBwcm9wZXJ0aWVzOiBwcm9wZXJ0aWVzLFxuICAgICAgICAgICAgZ2V0UHJvcGVydGllczogZ2V0UHJvcGVydGllcyxcbiAgICAgICAgICAgIGdldFByb3BlcnR5QnlJZDogZ2V0UHJvcGVydHlCeUlkXG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiBnZXRQcm9wZXJ0aWVzKCkge1xuICAgICAgICAgICAgJGh0dHAuZ2V0KGNvbmZpZy51cmwgKyBcIi9hcGkvcHJvcGVydGllc1wiKVxuICAgICAgICAgICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzLmxpc3QgPSBbXS5jb25jYXQocmVzcG9uc2UuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHByb3BlcnRpZXMpO1xuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGVycm9yKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuICAgICAgICAgICAgICAgIH0pOztcbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIGdldFByb3BlcnR5QnlJZChwcm9wZXJ0eUlkKSB7XG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcy5saXN0LmZpbmQoZnVuY3Rpb24ocHJvcGVyeSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdwcm9wZXJ5Ll9pZCA9PSBwcm9wZXJ0eUlkJyArIHByb3BlcnkuX2lkICsgJyAnICsgcHJvcGVydHlJZClcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvcGVyeS5faWQgPT0gcHJvcGVydHlJZDtcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG5cbn0pKCk7Il0sImZpbGUiOiJtb2R1bGVzLmpzIn0=
