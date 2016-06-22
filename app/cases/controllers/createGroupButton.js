'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('CreateGroupButton', [
    '$scope',
    '$uibModal',
    function ($scope, $uibModal) {
        $scope.openCreateGroupDialog = function () {
            $uibModal.open({
                templateUrl: 'cases/views/createGroupModal.html',
                controller: 'CreateGroupModal'
            });
        };
    }
]);