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
    function ($scope, $modalInstance, SearchCaseService, strataService, AlertService,translate) {
        $scope.closeCases = function () {
            $modalInstance.close();
            AlertService.addWarningMessage(translate('Closing cases.'));
            angular.forEach(SearchCaseService.cases, angular.bind(this, function (kase) {
                if(kase.selected){
                    strataService.cases.put(kase.case_number, {status: 'Closed'}).then( angular.bind(kase, function (response) {
                        kase.selected = false;
                        AlertService.addSuccessMessage(translate('Case') + ' ' + kase.case_number + ' '+'successfully closed.');
                        kase.status = 'Closed';
                    }), function (error) {
                        AlertService.addStrataErrorMessage(error);
                    });
                }
            }));
        };
        $scope.closeModal = function () {
            $modalInstance.close();
        };
    }
]);

