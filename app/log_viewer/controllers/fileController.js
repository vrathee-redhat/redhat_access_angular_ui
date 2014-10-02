'use strict';
angular.module('RedhatAccess.logViewer').controller('fileController', [
    '$scope',
    '$rootScope',
    '$http',
    '$location',
    'files',
    'AlertService',
    'LOGVIEWER_EVENTS',
    function ($scope, $rootScope, $http, $location, files, AlertService, LOGVIEWER_EVENTS) {
        $scope.roleList = '';
        $scope.retrieveFileButtonIsDisabled = files.getRetrieveFileButtonIsDisabled();
        $scope.$watch(function () {
            return $scope.mytree.currentNode;
        }, function () {
            if ($scope.mytree.currentNode !== undefined && $scope.mytree.currentNode.fullPath !== undefined) {
                files.setSelectedFile($scope.mytree.currentNode.fullPath);
                files.setRetrieveFileButtonIsDisabled(false);
            } else {
                files.setRetrieveFileButtonIsDisabled(true);
            }
        });
        $scope.$watch(function () {
            return files.fileList;
        }, function () {
            $scope.roleList = files.fileList;
        });

        $scope.selectItem = function(){
            if(files.selectedFile !== undefined && !files.getRetrieveFileButtonIsDisabled()){
                $scope.fileSelected();
            }
        };

        $scope.fileSelected = function () {
            files.setFileClicked(true);
            var sessionId = $location.search().sessionId;
            var userId = $location.search().userId;
            $scope.$parent.$parent.sidePaneToggle = !$scope.$parent.$parent.sidePaneToggle;
            $http({
                method: 'GET',
                url: 'logs?sessionId=' + encodeURIComponent(sessionId) + '&userId=' + encodeURIComponent(userId) + '&path=' + files.selectedFile + '&machine=' + files.selectedHost
            }).success(function (data, status, headers, config) {
                files.file = data;
            }).error(function (data, status, headers, config) {
                AlertService.addDangerMessage(data);
            });
        };
        $rootScope.$on(LOGVIEWER_EVENTS.allTabsClosed, function () {
            $scope.$parent.$parent.sidePaneToggle = !$scope.$parent.$parent.sidePaneToggle;
        });
    }
]);
