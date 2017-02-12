/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.auth')
    .controller('AuthCtrl', AuthCtrl);

  /** @ngInject */
  function AuthCtrl($scope, fileReader, $filter, $uibModal, $window, $rootScope, $state, $timeout) {
    console.log('auth!');
    $rootScope.isLogged = false;
    $scope.loginData = {};
    $scope.progress = false;

    if(Parse.User.current()){
      $rootScope.isLogged = true;
      $state.go('dashboard');
    }

    $scope.doLogin = function() {
      userLogin($scope.loginData.email, $scope.loginData.password);
    };

    var userLogin = function(email, password){
      Parse.User.logIn(email, password, {
        success: function(user) {
          // Do stuff after successful login.
          console.log(user.attributes);
          $scope.progress = true;
          $rootScope.isLogged = true;
          $state.go('dashboard');
        },
        error: function(user, error) {
          $scope.progress = false;
          $uibModal.open({
            animation: true,
            templateUrl: 'app/pages/auth/invalidModal.html',
            size: 'sm',
            resolve: {
              items: function () {
                return $scope.items;
              }
            }
          });
        }
      });
    }

  }

})();
