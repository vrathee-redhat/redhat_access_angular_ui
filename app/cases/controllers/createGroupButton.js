'use strict';
/*global $ */
angular.module('RedhatAccess.cases').controller('CreateGroupButton', [
    '$scope',
    '$modal',
    function ($scope, $modal) {
        $scope.openCreateGroupDialog = function () {
            $modal.open({
                templateUrl: 'cases/views/createGroupModal.html',
                controller: 'CreateGroupModal'
            });
        };
    }
]);