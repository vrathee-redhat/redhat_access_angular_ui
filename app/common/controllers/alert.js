'use strict';
angular.module('RedhatAccess.header').controller('AlertController', [
    '$scope',
    'AlertService',
    function ($scope, AlertService) {
        $scope.AlertService = AlertService;
        $scope.closeable = true;
        $scope.closeAlert = function (index) {
            AlertService.alerts.splice(index, 1);
        };
        $scope.dismissAlerts = function () {
            AlertService.clearAlerts();
        };
    }
])