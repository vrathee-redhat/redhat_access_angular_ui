'use strict';
angular.module('RedhatAccess.header').controller('404', [
    '$scope',
    'securityService',
    function ($scope, securityService) {
        $scope.securityService = securityService;
    }
])