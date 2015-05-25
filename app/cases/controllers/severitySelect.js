'use strict';
angular.module('RedhatAccess.cases').controller('SeveritySelect', [
    '$scope',
    'CaseService',
    function ($scope, CaseService) {
        $scope.CaseService = CaseService;
    }
]);