/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('AddItemModalCtrl', AddItemModalCtrl);

  /** @ngInject */
  function AddItemModalCtrl($scope, items, $uibModalInstance, toastr) {
    console.log(items);
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
      var Item = Parse.Object.extend(items);
      var item = new Item();

      item.set('name', $scope.item.name);
      item.set('description', $scope.item.description);

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
