(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    injections = ['rulesDataService', '$routeParams'];


  function managersCtrl(rulesDataService, $routeParams) {
    // TODO: figureout better propId solution
    var vm = this,
      propertyId = $routeParams.propertyId;

    vm.managerName = 'Hugo Boss';

    // rulesDataService.create(propertyId, {text: 1, propertyId: propertyId})
    getAllRules();

    function getAllRules() {
      rulesDataService.getAll().then(function(response) {
        vm.rules = response.data;
      });
    }

    function clearNewRule() {
      vm.newRule = {}
    }

    vm.add = function(rule) {
      rulesDataService.create(propertyId, rule).then(function() {
        clearNewRule();
        getAllRules();
      });
    }

    // TODO: future update functionality
    vm.edit = function(rule) {
      rulesDataService.update(rule._id, rule).then(function() {
        getAllRules();
      });
    }

    vm.remove = function(id) {
      rulesDataService.remove(id).then(function() {
        getAllRules();
      });
    }
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);