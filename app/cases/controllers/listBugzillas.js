'use strict';
angular.module('RedhatAccess.cases').controller('ListBugzillas', [
    '$scope',
    'CaseService',
    'securityService',
    function ($scope, CaseService, securityService) {
        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
    }
]);