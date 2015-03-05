'use strict';
/*global $ */
/*jshint camelcase: false*/
angular.module('RedhatAccess.cases').controller('ConfirmCaseStateChangeModal', [
    '$scope',
    '$modalInstance',
    'CaseService',
    'strataService',
    'AlertService',
    function ($scope, $modalInstance, CaseService, strataService, AlertService) {
        $scope.CaseService = CaseService;
        $scope.closeCases = function () {
            $modalInstance.close();
            CaseService.updateCase().then(function () {
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
        $scope.closeModal = function () {
            $modalInstance.close();
        };
    }
]);

