(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app');
  var injections = [
    'rulesDataService',
    '$routeParams',
    'propertiesService',
    'contractsService',
    'authService',
    'decalService',
    '$location'
  ];


  function managersCtrl(
    rulesDataService,
    $routeParams,
    propertiesService,
    contractsService,
    authService,
    decalService,
    $location
  ) {
    // TODO: figureout better propId solution
    var vm = this;
    var user = authService.getUser();

    vm.managerName = null;
    vm.property = null;

    propertiesService.getUsersProperty(user._id).then(function (res) {
      if (!res) {
        vm.message = 'Unfortunately we couldn\'t find your property.';
        throw( new Error('Property not found') );
      } else {
        vm.property = res.data;
        vm.managerName = vm.property.name;
        if (vm.property.towingMatrix) {
          vm.towingMatrix = JSON.parse(vm.property.towingMatrix);
          vm.towingMatrix.date = new Date(vm.towingMatrix.date);
        }
      }
    }).then(function () {
      return contractsService.check(vm.property._id);
    }).then(function (res) {
      if (!res.data) {
        vm.message = 'Your contract is not activated.';
        throw( new Error(vm.message) );
      }
    }).then(function () {
      return getAllRules(vm.property._id);
    }).then(function () {
      return propertiesService.getPhotos(vm.property._id);
    }).then(
      function (res) {
        if (res) {
          vm.photos = res.data.map(function (photo) {
            return propertiesService.getPhotoPath(photo);
          });
        }
      }, function (err) {
        console.log(err);
      }
    );

    function getAllRules(propertyId) {
      return rulesDataService.get(propertyId)
        .then(function(response) {
          vm.rules = response.data;
        });
    }
    getAllDecals();

    function clearNewRule() {
      vm.newRule = {}
    }

    vm.edit = function(ruleIndex) {
      vm.rules[ruleIndex].editmode = true;
    }

    vm.add = function(rule) {
      rulesDataService.create(vm.property._id, rule)
        .then(function() {
          clearNewRule();
          getAllRules(vm.property._id);
        });
    }

    vm.save = function(ruleIndex, id, rule) {
      vm.rules[ruleIndex].editmode = false;
      rulesDataService.update(id, rule)
        .then(function() {
          getAllRules(vm.property._id);
        });
    }

    vm.remove = function(id) {
      rulesDataService.remove(id)
        .then(function() {
          getAllRules(vm.property._id);
        });
    }

    // ****** DECAL ******

    vm.stopPropagation = function($event) {
      $event.stopPropagation();
    }

    vm.showDecalPopup = function() {
      vm.decalPopupEditmod = true;
    }

    vm.hideDecalPopup = function() {
      vm.decalPopupEditmod = false;
    }

    function getAllDecals() {
      decalService.getDecals()
        .then(function(res) {
          vm.decals = res.data;
        });
    }

    vm.removeDecal = function(id) {
      decalService.removeDecal(id)
      .then(function() {
        getAllDecals();
      });
    }

    // ****** END DECAL ******

    // ****** TOWING MATRIX ******

    vm.saveTowingMatrix = function(form) {
      vm.property.towingMatrix = JSON.stringify(vm.towingMatrix);
      propertiesService.updateTowingMatrix(vm.property._id, vm.property)
        .then(function(res) {
        });
    }

    // ****** END TOWING MATRIX ******
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);