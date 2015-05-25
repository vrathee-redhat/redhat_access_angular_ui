/*global parseList*/
'use strict';
angular.module('RedhatAccess.logViewer').controller('DropdownCtrl', [
    '$scope',
    '$http',
    '$location',
    'files',
    'hideMachinesDropdown',
    'AlertService',
    'translate',
    function ($scope, $http, $location, files, hideMachinesDropdown, AlertService,translate) {
        $scope.machinesDropdownText = translate('Please Select the Machine');
        $scope.items = [];
        $scope.hideDropdown = hideMachinesDropdown.value;
        $scope.loading = false;
        var sessionId = $location.search().sessionId;
        $scope.getMachines = function () {
            $http({
                method: 'GET',
                url: 'machines?sessionId=' + encodeURIComponent(sessionId)
            }).success(function (data, status, headers, config) {
                $scope.items = data;
            }).error(function (data, status, headers, config) {
                AlertService.addDangerMessage(data);
            });
        };
        $scope.machineSelected = function () {
            $scope.loading = true;
            var sessionId = $location.search().sessionId;
            var userId = $location.search().userId;
            files.selectedHost = this.choice;
            $scope.machinesDropdownText = this.choice;
            $http({
                method: 'GET',
                url: 'logs?machine=' + files.selectedHost + '&sessionId=' + encodeURIComponent(sessionId) + '&userId=' + encodeURIComponent(userId)
            }).success(function (data, status, headers, config) {
                $scope.loading = false;
                var tree = [];
                parseList(tree, data);
                files.setFileList(tree);
            }).error(function (data, status, headers, config) {
                $scope.loading = false;
                AlertService.addDangerMessage(data);
            });
        };
        if ($scope.hideDropdown) {
            $scope.machineSelected();
        } else {
            $scope.getMachines();
        }
    }
]);
