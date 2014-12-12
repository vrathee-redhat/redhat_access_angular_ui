'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('CreateGroupModal', [
    '$scope',
    '$modalInstance',
    'strataService',
    'securityService',
    'AlertService',
    'CaseService',
    'GroupService',
    'translate',
    function ($scope, $modalInstance, strataService, securityService, AlertService, CaseService, GroupService, translate) {
        $scope.createGroup = function () {
            AlertService.addWarningMessage(translate('Creating group') + ' ' + this.groupName + '...');
            $modalInstance.close();
            strataService.groups.create(this.groupName, securityService.loginStatus.authedUser.sso_username).then(angular.bind(this, function (success) {
                if(success !== null){
                    CaseService.groups.push({
                        name: this.groupName,
                        number: success
                    });
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.groupName);
                    GroupService.reloadTable();
                } else {
                    CaseService.populateGroups(securityService.loginStatus.authedUser.sso_username, true).then(angular.bind(this, function (groups) {
                        AlertService.clearAlerts();
                        AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.groupName);
                        GroupService.reloadTable();
                    }), function (error) {
                        AlertService.clearAlerts();
                        AlertService.addStrataErrorMessage(error);
                    });
                }
            }), function (error) {
                AlertService.clearAlerts();
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.closeModal = function () {
            $modalInstance.close();
        };
        $scope.onGroupNameKeyPress = function ($event) {
            if ($event.keyCode === 13) {
                angular.bind(this, $scope.createGroup)();
            }
        };
    }
]);