'use strict';
angular.module('RedhatAccess.cases').controller('DescriptionSection', [
    '$scope',
    '$modal',
    'CaseService',
    'CASE_EVENTS',
    'translate',
    function ($scope, $modal, CaseService, CASE_EVENTS, translate) {
        $scope.CaseService = CaseService;

        $scope.updateCase = function(){
            CaseService.confirmationModal = CASE_EVENTS.caseStatusChanged;
            CaseService.confirmationModalHeader = translate('Case status was changed.');
            CaseService.confirmationModalMessage = translate('Are you sure you want to change this case status to');
            CaseService.confirmationModalProperty = CaseService.kase.status.name;
        	$modal.open({
                templateUrl: 'cases/views/commonConfirmationModal.html',
                controller: 'CommonConfirmationModal'
            });
        };

        $scope.updateSeverity = function(){
            CaseService.confirmationModal = CASE_EVENTS.caseSeverityChanged;
            CaseService.confirmationModalHeader = translate('Case severity was changed.');
            CaseService.confirmationModalMessage = translate('Are you sure you want to change this case severity to');
            CaseService.confirmationModalProperty = CaseService.kase.severity.name;
            $modal.open({
                templateUrl: 'cases/views/commonConfirmationModal.html',
                controller: 'CommonConfirmationModal'
            });
        };
    }
]);
