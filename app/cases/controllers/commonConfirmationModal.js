'use strict';
/*global $ */
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('CommonConfirmationModal', [
    '$scope',
    '$modalInstance',
    'CaseService',
    'strataService',
    'AlertService',
    'SearchCaseService',
    'translate',
    'CASE_EVENTS',
    '$q',
    function ($scope, $modalInstance, CaseService, strataService, AlertService, SearchCaseService, translate, CASE_EVENTS, $q) {
        $scope.CaseService = CaseService;
        $scope.confirm = function () {
            $modalInstance.close();
            if(CaseService.confirmationModal === CASE_EVENTS.caseClose) {
                $scope.closeCases();
            } else {
                CaseService.updateCase().then(function () {
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }            
        };
        $scope.closeModal = function () {
            if(CaseService.confirmationModal === CASE_EVENTS.caseStatusChanged) {
                CaseService.kase.status = CaseService.prestineKase.status;
            } else if(CaseService.confirmationModal === CASE_EVENTS.caseSeverityChanged) {
                CaseService.kase.severity = CaseService.prestineKase.severity;
            }
            $modalInstance.close();
        };
        $scope.closeCases = function () {
            var promises = [];
            AlertService.addWarningMessage(translate('Closing cases.'));
            angular.forEach(SearchCaseService.cases, angular.bind(this, function (kase) {
                if(kase.selected){
                    var promise = strataService.cases.put(kase.case_number, {status: 'Closed'});
                    promise.then( angular.bind(kase, function (response) {
                        kase.selected = false;
                        AlertService.addSuccessMessage(translate('Case') + ' ' + kase.case_number + ' '+'successfully closed.');
                        kase.status = 'Closed';
                    }), function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                    promises.push(promise);
                }
            }));
            var parentPromise = $q.all(promises);
            parentPromise.then(function (success) {
                SearchCaseService.refreshFilterCache=true;
                CaseService.onSelectChanged();
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);

