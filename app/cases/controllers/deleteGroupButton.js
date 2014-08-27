'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('DeleteGroupButton', [
    '$scope',
    'strataService',
    'AlertService',
    'CaseService',
    '$q',
    '$filter',
    'GroupService',
    function ($scope, strataService, AlertService, CaseService, $q, $filter, GroupService) {
        $scope.deleteGroups = function () {
            var promises = [];
            angular.forEach(CaseService.groups, function (group, index) {
                if (group.selected) {
                    var promise = strataService.groups.remove(group.number);
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
                        AlertService.addSuccessMessage('Successfully deleted group ' + group.name);
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
                AlertService.addSuccessMessage('Successfully deleted groups.');
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);