'use strict';

export default class CommonConfirmationModal {
    constructor($scope, $uibModalInstance, CaseService, strataService, AlertService, SearchCaseService, gettextCatalog, CASE_EVENTS, $q) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.confirm = function () {
            $uibModalInstance.close();
            if (CaseService.confirmationModal === CASE_EVENTS.caseClose) {
                $scope.closeCases();
            } else {
                CaseService.updateCase().then(function () {
                    SearchCaseService.clear();
                }, function (error) {
                    AlertService.addStrataErrorMessage(error);
                });
            }
        };
        $scope.closeModal = function () {
            if (CaseService.confirmationModal === CASE_EVENTS.caseStatusChanged) {
                CaseService.kase.status = CaseService.prestineKase.status;
            } else if (CaseService.confirmationModal === CASE_EVENTS.caseSeverityChanged) {
                CaseService.kase.severity = CaseService.prestineKase.severity;
            }
            $uibModalInstance.close();
        };
        $scope.closeCases = function () {
            var promises = [];
            AlertService.addWarningMessage(gettextCatalog.getString('Closing cases.'));
            angular.forEach(SearchCaseService.cases, angular.bind(this, function (kase) {
                if (kase.selected) {
                    var promise = strataService.cases.put(kase.case_number, {status: 'Closed'});
                    promise.then(angular.bind(kase, function (response) {
                        kase.selected = false;
                        AlertService.addSuccessMessage(gettextCatalog.getString('Case  {{caseNumber}} successfully closed.', {caseNumber: kase.case_number}));
                        kase.status = 'Closed';
                    }), function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                    promises.push(promise);
                }
            }));
            var parentPromise = $q.all(promises);
            parentPromise.then(function (success) {
                SearchCaseService.refreshFilterCache = true;
                CaseService.onSelectChanged();
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
}
