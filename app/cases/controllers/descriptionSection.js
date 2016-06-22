'use strict';
angular.module('RedhatAccess.cases').controller('DescriptionSection', [
    '$scope',
    '$uibModal',
    'CaseService',
    'CASE_EVENTS',
    'gettextCatalog',
    function ($scope, $uibModal, CaseService, CASE_EVENTS, gettextCatalog) {
        $scope.CaseService = CaseService;

        $scope.updateCase = function(){
            CaseService.confirmationModal = CASE_EVENTS.caseStatusChanged;
            CaseService.confirmationModalHeader = gettextCatalog.getString('Case status was changed.');
            CaseService.confirmationModalMessage = gettextCatalog.getString('Are you sure you want to change this case status to {{statusName}}?',{statusName:CaseService.kase.status.name});
        	$uibModal.open({
                templateUrl: 'cases/views/commonConfirmationModal.html',
                controller: 'CommonConfirmationModal'
            });
        };

        $scope.updateSeverity = function(){
            if(CaseService.kase.severity.name.substring(0,1) === '1') CaseService.onChangeFTSCheck();

            CaseService.confirmationModal = CASE_EVENTS.caseSeverityChanged;
            CaseService.confirmationModalHeader = gettextCatalog.getString('Case severity was changed.');
            CaseService.confirmationModalMessage = gettextCatalog.getString('Are you sure you want to change this case severity to {{severityName}}?',{severityName:CaseService.kase.severity.name});
            $uibModal.open({
                templateUrl: 'cases/views/commonConfirmationModal.html',
                controller: 'CommonConfirmationModal'
            });
        };
    }
]);
