'use strict';

import hydrajs  from '../../shared/hydrajs';

export default class CepModal {
    constructor($scope, $uibModalInstance, AlertService, CaseService, DiscussionService, strataService, securityService, $q, $stateParams, RHAUtils, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.submittingRequest = false;
        $scope.securityService = securityService;
        $scope.disableSubmitRequest = true;
        $scope.cepContactName = '';
        $scope.cepWorkingHours = null;
        $scope.cepContactInformation = '';
        $scope.cepNotes = '';

        $scope.closeModal = function () {
            $scope.cepContactName = undefined;
            $scope.cepWorkingHours = null;
            $scope.cepContactInformation = undefined;
            $scope.cepNotes = undefined;
            CaseService.kase.cep = CaseService.prestineKase.cep;
            $uibModalInstance.close();
        };
        $scope.showErrorMessage = function (errorMessage) {
            AlertService.clearAlerts();
            $scope.closeModal();
            $scope.submittingRequest = false;;
            AlertService.addStrataErrorMessage(errorMessage);
        };
        $scope.onChangeCepInformation = function () {
            if (RHAUtils.isNotEmpty($scope.cepContactName) && !$scope.submittingRequest && RHAUtils.isNotEmpty($scope.cepWorkingHours)
               && RHAUtils.isNotEmpty($scope.cepContactInformation)) {
                $scope.disableSubmitRequest = false;
            } else {
                $scope.disableSubmitRequest = true;
            }
        };

        $scope.submitCEP = function () {
            $scope.submittingRequest = true;
            var fullComment = `A consultant has been engaged with this case:\n Name: ${$scope.cepContactName}\n Hours: ${$scope.cepWorkingHours}\n Contact information: ${$scope.cepContactInformation}\n ${$scope.cepNotes ? `Notes: ${$scope.cepNotes}`: ''} `;
            // add private comment on the case.
            strataService.cases.comments.post(CaseService.kase.case_number, fullComment, false, false).then(function(){
                var caseJSON = {'cep': true};
                var updateCase = strataService.cases.put(CaseService.kase.case_number, caseJSON);
                updateCase.then(function (response) {
                    CaseService.checkForCaseStatusToggleOnAttachOrComment();
                    AlertService.clearAlerts();
                    AlertService.addSuccessMessage(gettextCatalog.getString('CEP has been updated successfully'));
                    CaseService.kase.cep = true;
                    angular.copy(CaseService.kase, CaseService.prestineKase);
                },
                function (error) {
                    $scope.showErrorMessage(error);
                });
                CaseService.populateComments($stateParams.id).then(function (comments) {
                    $scope.closeModal();
                    $scope.submittingRequest = false;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }, function (error) {
                $scope.showErrorMessage(error);
            });
        };
    }
}
