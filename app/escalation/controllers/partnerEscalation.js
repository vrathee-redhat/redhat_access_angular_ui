'use strict';
angular.module('RedhatAccess.cases').controller('PartnerEscalation', [
    '$scope',
    'EscalationRequestService',
    '$rootScope',
    'RHAUtils',
    'AUTH_EVENTS',
    'AlertService',
    function ($scope, EscalationRequestService, $rootScope, RHAUtils, AUTH_EVENTS, AlertService) {
        $scope.EscalationRequestService = EscalationRequestService;
        $scope.disableSendRequest = true;
        $scope.geoList = ['NA','EMEA','LATAM','APAC','None'];
        
        $scope.submitEscalationRequest = function() {
            EscalationRequestService.sendEscalationRequest();
        };
        $scope.mandatoryFieldCheck = function() {
            if (RHAUtils.isNotEmpty(EscalationRequestService.accountNumber) && RHAUtils.isNotEmpty(EscalationRequestService.caseNumber)
                && RHAUtils.isNotEmpty(EscalationRequestService.geo) && RHAUtils.isNotEmpty(EscalationRequestService.issueDescription)) {
                $scope.disableSendRequest = false;
            } else {
                $scope.disableSendRequest = true;
            }
        };
        
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            AlertService.clearAlerts();
        });
    }
]);