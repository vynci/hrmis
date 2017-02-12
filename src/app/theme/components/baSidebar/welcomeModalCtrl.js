/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('WelcomeModalCtrl', WelcomeModalCtrl);

  /** @ngInject */
  function WelcomeModalCtrl($scope, items) {
    console.log(items);
    $scope.userInfo = items;
  }
})();
