'use strict';
angular.module('RedhatAccess.header').controller('403', [
    '$scope',
    'securityService',
    'HeaderService',
    function ($scope, securityService, HeaderService) {
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
    }
]);
