/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages')
    .run(runPages);

  /** @ngInject */
  function runPages($window, $rootScope) {
    console.log('run!');

    if(Parse.User.current()){
      $rootScope.isLogged = true;
      $rootScope.logout = function(){
        Parse.User.logOut().then(function(){
          $window.location.href = "#/auth";
        });
      }
    }else{
      $rootScope.isLogged = false;
      $window.location.href = "#/auth";
    }

  }

})();
