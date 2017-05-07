/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('DeleteItemModalCtrl', DeleteItemModalCtrl);

  /** @ngInject */
  function DeleteItemModalCtrl($scope, items, $uibModalInstance, toastr) {
    function showSuccessMsg(msg) {
      toastr.success(msg);
    };

    $scope.deleteItem = function(){
      items.destroy({
        success: function(myObject) {
          showSuccessMsg('Item Successfully Deleted.');
          $uibModalInstance.close('delete:success');
        },
        error: function(myObject, error) {

        }
      });
    }
  }

})();
