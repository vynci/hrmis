/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.dashboard')
    .controller('DashboardCtrl', DashboardCtrl);

  /** @ngInject */
  function DashboardCtrl($scope, $rootScope, $state) {
    if(Parse.User.current()){
      $rootScope.isLogged = true;

    }else{
      $rootScope.isLogged = false;
      $state.go('auth');
    }
  }

})();
