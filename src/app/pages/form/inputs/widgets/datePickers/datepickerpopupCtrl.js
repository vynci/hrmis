/**
 * Created by n.poltoratsky
 * on 23.06.2016.
 */
(function(){
    'use strict';

    angular.module('BlurAdmin.pages.form')
        .controller('datepickerpopupCtrl', datepickerpopupCtrl);

    /** @ngInject */
    function datepickerpopupCtrl($scope) {
      console.log('date picker 2');
        $scope.open = open;
        $scope.opened = false;
        $scope.formats = ['MM/dd/yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.format = $scope.formats[0];
        $scope.options = {
            showWeeks: false
        };

        function open() {
            $scope.opened = true;
        }
    }
})();
