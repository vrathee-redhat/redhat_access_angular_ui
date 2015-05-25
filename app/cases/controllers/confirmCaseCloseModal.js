'use strict';
/*global $ */
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('ConfirmCaseCloseModal', [
    '$scope',
    '$modalInstance',
    'SearchCaseService',
    'strataService',
    'AlertService',
    'translate',
    'CaseService',
    '$q',
    function ($scope, $modalInstance, SearchCaseService, strataService, AlertService,translate,CaseService,$q) {
        $scope.closeCases = function () {
            $modalInstance.close();
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
        $scope.closeModal = function () {
            $modalInstance.close();
        };
    }
]);

