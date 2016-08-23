(function(window, document, NG) {

  if (typeof NG === 'undefined') {
    alert('Problem with app initialization!');
  }

  var app = NG.module('app'),
    injections = [];


  function managersCtrl() {
    var vm = this;

    vm.managerName = 'Hugo Boss';
  }

  managersCtrl.$inject = injections;
  app.controller('managersCtrl', managersCtrl);

})(window, document, angular);