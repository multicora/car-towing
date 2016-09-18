(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app');
  var injections = ['rulesDataService', '$routeParams', 'propertiesService', 'authService'];


  function managersCtrl(rulesDataService, $routeParams, propertiesService, authService) {
    // TODO: figureout better propId solution
    var vm = this;
    var property = null;
    var user = authService.getUser();

    vm.managerName = null;

    propertiesService.getUsersProperty(user._id).then(function (res) {
      property = res.data;
      vm.managerName = property.name;

      return property;
    }).then(function (property) {
      getAllRules(property._id);
    });


    function getAllRules(propertyId) {
      rulesDataService.get(propertyId).then(function(response) {
        vm.rules = response.data;
      });
    }

    function clearNewRule() {
      vm.newRule = {}
    }

    vm.add = function(rule) {
      rulesDataService.create(property._id, rule).then(function() {
        clearNewRule();
        getAllRules(property._id);
      });
    }

    // TODO: future update functionality
    vm.edit = function(rule) {
      rulesDataService.update(rule._id, rule).then(function() {
        getAllRules(property._id);
      });
    }

    vm.remove = function(id) {
      rulesDataService.remove(id).then(function() {
        getAllRules(property._id);
      });
    }
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);