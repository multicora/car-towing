(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    injections = ['rulesDataService'];


  function managersCtrl(rulesDataService) {
    var vm = this;

    vm.managerName = 'Hugo Boss';

    rulesDataService.getAll();
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);