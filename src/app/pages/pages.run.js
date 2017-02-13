/**
 * @author v.lugovksy
 * created on 15.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages')
    .run(runPages);

  /** @ngInject */
  function runPages($window, $rootScope, $state) {
    console.log('run!');

    $rootScope.logout = function(){
      Parse.User.logOut().then(function(){
        $window.location.href = "#/auth";
        $state.go('auth');
      });
    }

  }

})();
