/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('EditItemModalCtrl', EditItemModalCtrl);

  /** @ngInject */
  function EditItemModalCtrl($scope, items, currentData, $uibModalInstance, toastr) {
    console.log(items);
    console.log(currentData);
    $scope.modalType = 'Edit';
    $scope.itemType = items;
    $scope.item = {
      name : currentData.get('name'),
      description : currentData.get('description')
    };

    function showSuccessMsg(msg) {
      toastr.success(msg);
    };

    function showErrorMsg(msg) {
      toastr.error(msg, 'Error');
    };

    $scope.saveItem = function(){

      currentData.set('name', $scope.item.name);
      currentData.set('description', $scope.item.description);

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
