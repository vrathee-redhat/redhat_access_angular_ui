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
    'CaseQueueService',
    function ($scope, $rootScope, $location, RHAUtils, AUTH_EVENTS, AlertService, securityService, HeaderService, translate,CaseQueueService) {
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
        $scope.CaseQueueService = CaseQueueService;
    }
]);
