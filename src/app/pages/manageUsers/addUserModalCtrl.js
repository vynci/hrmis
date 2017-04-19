/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('AddUserModalCtrl', AddUserModalCtrl);

  /** @ngInject */
  function AddUserModalCtrl($scope, items, $uibModalInstance, toastr) {
    $scope.link = '';

    $scope.newUser = {
      email: '',
      password : '',
      confirmPassword : ''
    };

    $scope.createUser = function(close){
      console.log($scope.newUser);
      console.log($uibModalInstance);
      createHR();
    }

    function showSuccessMsg(msg) {
      toastr.success(msg);
    };

    function showErrorMsg(msg) {
      toastr.error(msg, 'Error');
    };

    function createHR(){
      console.log($scope.newUser);
      if($scope.newUser.email && $scope.newUser.password){
        if($scope.newUser.confirmPassword === $scope.newUser.password){
          var User = Parse.Object.extend("User");
          var user = new User();

          user.set('username', $scope.newUser.email);
          user.set('password', $scope.newUser.password);
          user.set('email', $scope.newUser.email);
          user.set('userTypeId', 'J7ELLa1Czi');

          user.save(null, {
            success: function(user) {
              showSuccessMsg('HR Successfully Added.');
              $uibModalInstance.close($scope.link);
            },
            error: function(user, error) {
              showErrorMsg('Something went wrong, Please Try Again.');
            }
          });
        } else{
          showErrorMsg('Password did not match.');
        }

      }else{
        console.log('no save!');
        showErrorMsg('Please fill-out required fields.');
      }
    }
  }
})();
