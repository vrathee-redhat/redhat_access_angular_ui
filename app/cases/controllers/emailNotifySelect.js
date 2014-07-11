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
  'EDIT_CASE_CONFIG',
  function($scope, CaseService, securityService, AlertService, strataService, $filter, RHAUtils, EDIT_CASE_CONFIG) {

    $scope.securityService = securityService;
    $scope.CaseService = CaseService;
    $scope.showEmailNotifications = EDIT_CASE_CONFIG.showEmailNotifications;

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

    securityService.registerAfterLoginEvent(CaseService.populateUsers);
  }
]);
