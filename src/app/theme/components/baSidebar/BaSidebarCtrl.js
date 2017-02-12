/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($scope, baSidebarService, userService, $uibModal) {

    var user = Parse.User.current();

    userService.getById(user.id)
    .then(function(results) {
      // Handle the result
      var userTypeId = results[0].get('userTypeId');
      var email = results[0].get('username');

      userService.userType(userTypeId)
      .then(function(results) {
        // Handle the result
        var links = results[0].get('sidebarLinks');
        var localMenuItems = baSidebarService.getMenuItems();
        $scope.menuItems = [];

        $scope.userinfo = {
          email : email,
          userType : results[0].get('type')
        }

        $uibModal.open({
          animation: true,
          templateUrl: 'app/theme/components/baSidebar/successModal.html',
          controller : 'WelcomeModalCtrl',
          size: 'sm',
          resolve: {
            items: function () {
              return $scope.userinfo;
            }
          }
        });

        angular.forEach(links, function(value, key) {
          var userSidebarLinks = value;
          angular.forEach(localMenuItems, function(value, key) {
            if(value.name === userSidebarLinks){
              $scope.menuItems.push(value);
            }
          });
        });
        $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

      }, function(err) {
        console.log(err);
      }, function(percentComplete) {
        console.log(percentComplete);
      });

    }, function(err) {
      console.log(err);
    }, function(percentComplete) {
      console.log(percentComplete);
    });

    $scope.hoverItem = function ($event) {
      $scope.showHoverElem = true;
      $scope.hoverElemHeight =  $event.currentTarget.clientHeight;
      var menuTopValue = 66;
      $scope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
    };

    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden()) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
  }
})();
