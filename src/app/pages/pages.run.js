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

    if(!$rootScope.profilePic){
      $rootScope.profilePic = 'http://hrmis-api.herokuapp.com/parse/files/myAppId/709d67e1750729d0f4f8f15837e28713_Profile-sky-ovnis.jpg';
    }

    $rootScope.logout = function(){
      Parse.User.logOut().then(function(){
        $window.location.href = "#/auth";
        $state.go('auth');
      });
    }

  }

})();
