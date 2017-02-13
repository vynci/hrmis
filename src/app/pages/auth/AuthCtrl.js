/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.auth')
    .controller('AuthCtrl', AuthCtrl);

  /** @ngInject */
  function AuthCtrl($scope, fileReader, $filter, $uibModal, $window, $rootScope, $state, $timeout, $q) {
    console.log('auth!');
    var defer = $q.defer();

    $rootScope.isLogged = false;
    $scope.loginData = {};

    if(Parse.User.current()){
      $rootScope.isLogged = true;
      $state.go('dashboard');
    }

    $scope.progressFunction = function(){
      return defer.promise;
    }

    $scope.doLogin = function() {
      userLogin($scope.loginData.email, $scope.loginData.password);
    };

    var userLogin = function(email, password){
      Parse.User.logIn(email, password, {
        success: function(user) {
          // Do stuff after successful login.
          console.log(user.attributes);
          defer.resolve(true);
          $rootScope.isLogged = true;
          $state.go('dashboard');
        },
        error: function(user, error) {
          defer.resolve(true);
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
