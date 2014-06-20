'use strict';

angular.module('RedhatAccess.cases')
.controller('EmailNotifySelect', [
  '$scope',
  'CaseService',
  'securityService',
  'AlertService',
  'strataService',
  '$filter',
  'RHAUtils',
  function($scope, CaseService, securityService, AlertService, strataService, $filter, RHAUtils) {

    $scope.securityService = securityService;

    $scope.updateNotifyUsers = function() {
      if (!angular.equals(CaseService.updatedNotifiedUsers, CaseService.originalNotifiedUsers)) {

        angular.forEach(CaseService.originalNotifiedUsers, function(origUser) {
          var updatedUser = $filter('filter')(CaseService.updatedNotifiedUsers, origUser);

          if (RHAUtils.isEmpty(updatedUser)) {
            $scope.updatingList = true;
            strataService.cases.notified_users.remove(CaseService.case.case_number, origUser).then(
              function() {
                $scope.updatingList = false;
                CaseService.originalNotifiedUsers = CaseService.updatedNotifiedUsers;
              },
              function(error) {
                $scope.updatingList = false;
                AlertService.addStrataErrorMessage(error); 
              });
          }
        });

        angular.forEach(CaseService.updatedNotifiedUsers, function(updatedUser) {
          var originalUser = $filter('filter')(CaseService.originalNotifiedUsers, updatedUser);

          if (RHAUtils.isEmpty(originalUser)) {
            $scope.updatingList = true;
            strataService.cases.notified_users.add(CaseService.case.case_number, updatedUser).then(
              function() {
                CaseService.originalNotifiedUsers = CaseService.updatedNotifiedUsers;
                $scope.updatingList = false;
              },
              function(error) {
                $scope.updatingList = false;
                AlertService.addStrataErrorMessage(error); 
              });
          }
        });
      }
    };

    CaseService.populateUsers();
  }
]);
