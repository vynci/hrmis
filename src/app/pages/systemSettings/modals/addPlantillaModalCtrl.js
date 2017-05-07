/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('AddPlantillaModalCtrl', AddPlantillaModalCtrl);

  /** @ngInject */
  function AddPlantillaModalCtrl($scope, items, $uibModalInstance, toastr) {
    $scope.modalType = 'Add';
    $scope.itemType = items;
    $scope.item = {};

    function showSuccessMsg(msg) {
      toastr.success(msg);
    };

    function showErrorMsg(msg) {
      toastr.error(msg, 'Error');
    };

    $scope.saveItem = function(){
      var Item = Parse.Object.extend('Plantilla');
      var item = new Item();

      item.set('positionTitle', $scope.item.positionTitle);
      item.set('salaryGrade', parseInt($scope.item.salaryGrade));
      item.set('itemNo', $scope.item.itemNo);

      item.save(null, {
        success: function(user) {
          showSuccessMsg('Item Successfully Added.');
          $uibModalInstance.close(items);
        },
        error: function(user, error) {
          showErrorMsg('Something went wrong, Please Try Again.');
        }
      });
    }
  }

})();
