'use strict';
angular.module('RedhatAccess.ascension').controller('CaseQueue', [
    '$scope',
    '$location',
    'RHAUtils',
    'AUTH_EVENTS',
    'AlertService',
    'securityService',
    'HeaderService',
    'translate',
    'CaseQueueService',
    function ($scope, $location, RHAUtils, AUTH_EVENTS, AlertService, securityService, HeaderService, translate,CaseQueueService) {
        $scope.securityService = securityService;
        $scope.HeaderService = HeaderService;
        $scope.CaseQueueService = CaseQueueService;
    }
]);
