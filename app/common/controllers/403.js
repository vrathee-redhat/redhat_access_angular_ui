'use strict';
angular.module('RedhatAccess.header').controller('403', [
    '$scope',
    'securityService',
    function ($scope, securityService) {
        $scope.securityService = securityService;
    }
])