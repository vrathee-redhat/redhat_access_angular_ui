'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('DeleteGroupButton', [
    '$scope',
    'strataService',
    'AlertService',
    'CaseService',
    'securityService',
    '$q',
    '$filter',
    'GroupService',
    'translate',
    function ($scope, strataService, AlertService, CaseService, securityService, $q, $filter, GroupService, translate) {
        $scope.GroupService = GroupService;
        $scope.deleteGroups = function () {
            var promises = [];
            angular.forEach(CaseService.groups, function (group, index) {
                if (group.selected) {
                    var promise = strataService.groups.remove(group.number, securityService.loginStatus.authedUser.sso_username);
                    promise.then(function (success) {
                        var groups = $filter('filter')(CaseService.groups, function (g) {
                                if (g.number !== group.number) {
                                    return true;
                                } else {
                                    return false;
                                }
                            });
                        CaseService.groups = groups;
                        GroupService.reloadTable();
                        AlertService.addSuccessMessage(translate('Successfully deleted group') + ' ' + group.name);
                    }, function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                    promises.push(promise);
                }
            });
            AlertService.addWarningMessage('Deleting groups...');
            var parentPromise = $q.all(promises);
            parentPromise.then(function (success) {
                AlertService.clearAlerts();
                AlertService.addSuccessMessage(translate('Successfully deleted groups.'));
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);