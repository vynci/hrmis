/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('EditPlantillaModalCtrl', EditPlantillaModalCtrl);

  /** @ngInject */
  function EditPlantillaModalCtrl($scope, items, currentData, $uibModalInstance, toastr) {
    $scope.modalType = 'Edit';
    $scope.itemType = items;
    $scope.item = {
      positionTitle : currentData.get('positionTitle'),
      salaryGrade : currentData.get('salaryGrade'),
      itemNo : currentData.get('itemNo'),
    };

    function showSuccessMsg(msg) {
      toastr.success(msg);
    };

    function showErrorMsg(msg) {
      toastr.error(msg, 'Error');
    };

    $scope.saveItem = function(){

      currentData.set('positionTitle', $scope.item.positionTitle);
      currentData.set('salaryGrade', $scope.item.salaryGrade);
      currentData.set('itemNo', $scope.item.itemNo);

      currentData.save(null, {
        success: function(user) {
          showSuccessMsg('Item Successfully Updated.');
          $uibModalInstance.close(items);
        },
        error: function(user, error) {
          showErrorMsg('Something went wrong, Please Try Again.');
        }
      });
    }
  }

})();
