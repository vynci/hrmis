/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages.auth')
    .controller('AuthCtrl', AuthCtrl);

  /** @ngInject */
  function AuthCtrl($scope, fileReader, $filter, $uibModal, $window, $rootScope, $state, $timeout, $q, userService) {
    console.log('auth!');
    var defer = $q.defer();
    var defaultAvatar = "http://hrmis-api.herokuapp.com/parse/files/myAppId/709d67e1750729d0f4f8f15837e28713_Profile-sky-ovnis.jpg";

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
          userService.userType(user.get('userTypeId'))
          .then(function(results) {
            // Handle the result
            var userType = results[0];
            defer.resolve(true);
            $rootScope.isLogged = true;
            $rootScope.profilePic = defaultAvatar;

            $state.go(userType.get('defaultPage'));
          }, function(err) {
            console.log(err);
          });

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
