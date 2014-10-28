'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ExportCSVButton', [
    '$scope',
    'strataService',
    'AlertService',
    function ($scope, strataService, AlertService) {
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.exporting = false;
        $scope.exports = function () {
            $scope.exporting = true;
            strataService.cases.csv().then(function (response) {
                $scope.exporting = false;
            }, function (error) {
                AlertService.addStrataErrorMessage(error);
            });
        };
    }
]);