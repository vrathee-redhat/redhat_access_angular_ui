'use strict';
angular.module('RedhatAccess.cases').controller('EntitlementSelect', [
    '$scope',
    'strataService',
    'AlertService',
    '$filter',
    'RHAUtils',
    'CaseService',
    function ($scope, strataService, AlertService, $filter, RHAUtils, CaseService) {
        $scope.CaseService = CaseService;
        CaseService.populateEntitlements();
    }
]);