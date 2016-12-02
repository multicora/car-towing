(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app');
  var injections = ['rulesDataService', '$routeParams', 'propertiesService', 'authService', 'decalService', '$location'];


  function managersCtrl(rulesDataService, $routeParams, propertiesService, authService, decalService, $location) {
    // TODO: figureout better propId solution
    var vm = this;
    var property = null;
    var user = authService.getUser();

    vm.managerName = null;

    propertiesService.getUsersProperty(user._id)
      .then(function (res) {
        if (!res.data) {
          vm.message = 'Unfortunately we couldn\'t find your property.';
        }
        property = res.data;
        vm.managerName = property.name;
        if (property.towingMatrix) {
          vm.towingMatrix = JSON.parse(property.towingMatrix);
          vm.towingMatrix.date = new Date(vm.towingMatrix.date);
        }

        return property;
    }).then(function (property) {
      return getAllRules(property._id);
    }).then(function () {
      return propertiesService.getPhotos(property._id);
    }).then(function (res) {
      vm.photos = res.data.map(function (photo) {
        return propertiesService.getPhotoPath(photo);
      });
    });


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
      rulesDataService.create(property._id, rule)
        .then(function() {
          clearNewRule();
          getAllRules(property._id);
        });
    }

    vm.save = function(ruleIndex, id, rule) {
      vm.rules[ruleIndex].editmode = false;
      rulesDataService.update(id, rule)
        .then(function() {
          getAllRules(property._id);
        });
    }

    vm.remove = function(id) {
      rulesDataService.remove(id)
        .then(function() {
          getAllRules(property._id);
        });
    }

    // ****** DECAL ******

    vm.showDecalPopup = function() {
      vm.decalPopupEditmod = true;
    }

    vm.hideDecalPopup = function() {
      vm.decalPopupEditmod = false;
    }

    function getAllDecals() {
      decalService.getDecals()
        .then(function(res) {
          // console.log(res.data);
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
      property.towingMatrix = JSON.stringify(vm.towingMatrix);
      propertiesService.updateTowingMatrix(property._id, property)
        .then(function(res) {
        });
    }

    // ****** END TOWING MATRIX ******
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);