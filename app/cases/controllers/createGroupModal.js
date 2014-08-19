'use strict';
/*global $ */

angular.module('RedhatAccess.cases')
.controller('CreateGroupModal', [
  '$scope',
  '$modalInstance',
  'strataService',
  'AlertService',
  'CaseService',
  'GroupService',
  function ($scope, $modalInstance, strataService, AlertService, CaseService, GroupService) {

    $scope.createGroup = function() {
      AlertService.addWarningMessage('Creating group ' + this.groupName + '...');
      $modalInstance.close();

      strataService.groups.create(this.groupName).then(
        angular.bind(this, function(success) {
          CaseService.groups.push({
            name: this.groupName,
            number: success
          });

          AlertService.clearAlerts();
          AlertService.addSuccessMessage('Successfully created group ' + this.groupName);
          GroupService.reloadTable();
        }),
        function(error) {
          AlertService.clearAlerts();
          AlertService.addStrataErrorMessage(error);
        }
      );

    };

    $scope.closeModal = function() {
      $modalInstance.close();
    };

    $scope.onGroupNameKeyPress = function($event) {
      if ($event.keyCode === 13) {
        angular.bind(this, $scope.createGroup)();
      }
    };
  }
]);
