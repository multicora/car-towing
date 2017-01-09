(function () {
  Number.prototype.padLeft = function(base,chr){
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
  }
  // Ionic carTowingApp App

  // angular.module is a global place for creating, registering and retrieving Angular modules
  // 'carTowingApp' is the name of this angular module example (also set in a <body> attribute in index.html)
  // the 2nd parameter is an array of 'requires'
  angular.module('carTowingApp', ['ionic', 'ngCordova', 'ui.router', 'DatabaseModule']);

})();
