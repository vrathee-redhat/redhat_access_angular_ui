'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('CreateGroupModal', [
    '$scope',
    '$modalInstance',
    'strataService',
    'AlertService',
    'CaseService',
    'GroupService',
    'translate',
    function ($scope, $modalInstance, strataService, AlertService, CaseService, GroupService, translate) {
        $scope.createGroup = function () {
            AlertService.addWarningMessage(translate('Creating group') + ' ' + this.groupName + '...');
            $modalInstance.close();
            strataService.groups.create(this.groupName).then(angular.bind(this, function (success) {
                if(success !== undefined){
                    CaseService.groups.push({
                        name: this.groupName,
                        number: success
                    });
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.groupName);
                    GroupService.reloadTable();
                } else {
                    CaseService.populateGroups().then(function (groups) {
                        AlertService.clearAlerts();
                        AlertService.addSuccessMessage(translate('Successfully created group') + ' ' + this.groupName);                        
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