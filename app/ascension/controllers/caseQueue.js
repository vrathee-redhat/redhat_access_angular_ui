'use strict';
angular.module('RedhatAccess.ascension').controller('CaseQueue', [
    '$scope',
    '$rootScope',
    '$location',
    'RHAUtils',
    'AUTH_EVENTS',
    'AlertService',
    'securityService',
    'HeaderService',
    'translate',
    function ($scope, $rootScope, $location, RHAUtils, AUTH_EVENTS, AlertService, securityService, HeaderService, translate) {
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
    }
]);