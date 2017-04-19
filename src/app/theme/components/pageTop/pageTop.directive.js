/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
      .directive('pageTop', pageTop);

  /** @ngInject */
  function pageTop() {
    return {
      restrict: 'E',
      templateUrl: 'app/theme/components/pageTop/pageTop.html',
      controller : function($scope, $rootScope, systemSettingService){

        getSystemSetting();

        $rootScope.applyNavBarSystemSettings = getSystemSetting;

        function getSystemSetting(){
          systemSettingService.getById('rfeNg7kJH2')
          .then(function(results) {
            // Handle the result
            $scope.applicationInfo = {
              accountName : results[0].get('accountName'),
              accountAddress : results[0].get('accountAddress'),
              accountContactNumber : results[0].get('accountContactNumber'),
              accountLogo : results[0].get('accountLogo')
            };
          }, function(err) {
            console.log(err);
          });
        }
      }
    };
  }

})();
