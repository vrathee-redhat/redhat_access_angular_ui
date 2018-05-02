'use strict';

// import hydrajs  from '../../shared/hydrajs.js';

export default class RequestManagementEscalationModal {
    constructor($scope, $uibModalInstance, AlertService, CaseService, DiscussionService, strataService, securityService, $q, $stateParams, RHAUtils, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.submittingRequest = false;
        $scope.escalationSubject = '';
        $scope.escalationDescription = '';
        $scope.escalationExpectations = '';
        $scope.securityService = securityService;
        if (RHAUtils.isNotEmpty(CaseService.commentText)) {
            $scope.disableSubmitRequest = false;
            CaseService.escalationCommentText = CaseService.commentText;
        } else {
            $scope.disableSubmitRequest = true;
        }
        $scope.submitRequestClick = angular.bind($scope, function (commentText) {
            $scope.submittingRequest = true;
            var fullComment = 'Request Management Escalation: ' + commentText;
            var onSuccess = function (response) {
                var caseJSON = {'escalated': true};
                var updateCase = strataService.cases.put(CaseService.kase.case_number, caseJSON);
                updateCase.then(function (response) {
                    CaseService.checkForCaseStatusToggleOnAttachOrComment();
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });

                CaseService.populateComments($stateParams.id).then(function (comments) {
                    $scope.closeModal();
                    if (CaseService.localStorageCache) {
                        CaseService.localStorageCache.remove(CaseService.kase.case_number + securityService.loginStatus.authedUser.sso_username);
                    }
                    $scope.submittingRequest = false;
                    CaseService.draftSaved = false;
                    CaseService.draftComment = undefined;
                    CaseService.commentText = undefined;
                    DiscussionService.commentTextBoxEnlargen = false;
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            };
            var onError = function (error) {
                AlertService.addStrataErrorMessage(error);
            };

            if (CaseService.localStorageCache) {
                if (CaseService.draftCommentOnServerExists) {
                    strataService.cases.comments.put(CaseService.kase.case_number, fullComment, false, true, CaseService.draftComment.id).then(onSuccess, onError);
                }
                else {
                    strataService.cases.comments.post(CaseService.kase.case_number, fullComment, true, false).then(onSuccess, onError);
                }
            }
            else {
                if (RHAUtils.isNotEmpty(CaseService.draftComment)) {
                    strataService.cases.comments.put(CaseService.kase.case_number, fullComment, false, true, CaseService.draftComment.id).then(onSuccess, onError);
                } else {
                    strataService.cases.comments.post(CaseService.kase.case_number, fullComment, true, false).then(onSuccess, onError);
                }
            }


        });
        $scope.closeModal = function () {
            CaseService.escalationCommentText = undefined;
            $uibModalInstance.close();
        };
        $scope.onNewEscalationComment = function () {
            if (RHAUtils.isNotEmpty($scope.escalationSubject) && !$scope.submittingRequest && RHAUtils.isNotEmpty($scope.escalationDescription)
        && RHAUtils.isNotEmpty($scope.escalationExpectations)) {
                $scope.disableSubmitRequest = false;
            } else if (RHAUtils.isEmpty(CaseService.escalationCommentText)) {
                $scope.disableSubmitRequest = true;
            }
        };

        $scope.submitRMEEscalation = function () {
            // hydrajs.users.getUserBySSO(CaseService.kase.contact_sso_username).then((u) => {
            //     console.log(u);
            // });
            $scope.submittingRequest = true;
            let escalationJSON = {
                'record_type': 'Active Customer Escalation',
                'subject': $scope.escalationSubject,
                'issue_description': $scope.escalationDescription,
                'escalation_source': 'RME Escalation',
                'expectations': $scope.escalationExpectations,
                'status': 'New',
                'account_number': CaseService.kase.account_number,
                'case_number': CaseService.kase.case_number,
                'customer_name':  securityService.loginStatus.authedUser.loggedInUser,
                'customer_email': securityService.loginStatus.authedUser.email,
                'customer_phone': securityService.loginStatus.authedUser.phone_number,
                'requestor': securityService.loginStatus.authedUser.loggedInUser,
                'requestor_email': securityService.loginStatus.authedUser.email,
                'requestor_phone': securityService.loginStatus.authedUser.phone_number,
                'already_escalated': false,
                'geo': 'APAC',
                'severity': '3',
            };
            const promise = strataService.escalationRequest.create(escalationJSON);
            promise.then((escalationNum) => {
                AlertService.clearAlerts();
                $scope.closeModal();
                $scope.submittingRequest = false;  
                if (escalationNum !== undefined) {       
                    AlertService.addSuccessMessage(gettextCatalog.getString('Your Escalation request has been sent successfully'));
                }
            }, (error) => {
                AlertService.clearAlerts();
                $scope.closeModal();
                $scope.submittingRequest = false;  
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
}
