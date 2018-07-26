'use strict';

import hydrajs  from '../../shared/hydrajs';

export default class ShowRmeEscalation {
    constructor($scope, RHAUtils, CaseService, AlertService, strataService, $stateParams, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.submittingRequest = false;

        $scope.requestUpdateRMEEscalation = function (escalationName) {
            $scope.submittingRequest = true;
            var comment = `Request Management Escalation:\n Your update Escalation request submitted successfully`;
            const updateJson = {
                escalationName: escalationName,
                isPrivate: false,
                text: comment,
                isRequestForUpdate: true,
                isRequestForReOpen: false,
                isRequestForClosure: false
            };
            hydrajs.escalations.updateEscalations(escalationName, updateJson).then((updatedInfo) => {
                if (RHAUtils.isNotEmpty(updatedInfo)) {
                    $scope.submitEscalationComment(updatedInfo.escalationName, comment);
                }
            }, (error) => {
                $scope.showErrorMessage(error);
            });
        }

        $scope.requestReOpenRMEEscalation = function (escalationName) {
            $scope.submittingRequest = true;
            var comment = `Request Management Escalation:\n Your re-open Escalation request submitted successfully`;
            const updateJson = {
                escalationName: escalationName,
                isPrivate: false,
                text: comment,
                isRequestForUpdate: false,
                isRequestForReOpen: true,
                isRequestForClosure: false
            };
            hydrajs.escalations.updateEscalations(escalationName, updateJson).then((updatedInfo) => {
                if (RHAUtils.isNotEmpty(updatedInfo)) {
                    $scope.submitEscalationComment(updatedInfo.escalationName, comment);
                }
            }, (error) => {
                $scope.showErrorMessage(error);
            });
        }

        $scope.requestClosureRMEEscalation = function (escalationName) {
            $scope.submittingRequest = true;
            var comment = `Request Management Escalation:\n Your close Escalation request submitted successfully`;
            const updateJson = {
                escalationName: escalationName,
                isPrivate: false,
                text: comment,
                isRequestForUpdate: false,
                isRequestForReOpen: false,
                isRequestForClosure: true
            };
            hydrajs.escalations.updateEscalations(escalationName, updateJson).then((updatedInfo) => {
                if (RHAUtils.isNotEmpty(updatedInfo)) {
                    $scope.submitEscalationComment(updatedInfo.escalationName, comment);
                }
            }, (error) => {
                $scope.showErrorMessage(error);
            });
        }

        $scope.showErrorMessage = function (errorMessage) {
            $scope.submittingRequest = false;
            AlertService.clearAlerts();
            AlertService.addStrataErrorMessage(errorMessage);
        };

        $scope.submitEscalationComment = function (escalationNum, comment) {
            if (escalationNum !== undefined) {     
                CaseService.getCaseEscalation(CaseService.kase.account_number, CaseService.kase.case_number);
            }
            strataService.cases.comments.post(CaseService.kase.case_number, comment, true, false).then(function(){
                var caseJSON = {'escalated': true};
                var updateCase = strataService.cases.put(CaseService.kase.case_number, caseJSON);
                updateCase.then(function (response) {
                    CaseService.checkForCaseStatusToggleOnAttachOrComment();
                    if (escalationNum !== undefined) {
                        AlertService.clearAlerts();
                        AlertService.addSuccessMessage(gettextCatalog.getString('Your Escalation request has been updated successfully'));
                        $scope.submittingRequest = false;
                    }
                },
                function (error) {
                    $scope.showErrorMessage(error);
                });
                CaseService.populateComments($stateParams.id).then(function (comments) {
                    $scope.showErrorMessage(error);
                }, function (error) {
                    $scope.showErrorMessage(error);
                });
            }, function (error) {
                $scope.showErrorMessage(error);
            });
        }
    }
}
