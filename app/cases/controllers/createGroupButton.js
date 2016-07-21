'use strict';

export default class CreateGroupButton {
    constructor($scope, $uibModal) {
        'ngInject';

        $scope.openCreateGroupDialog = function () {
            $uibModal.open({
                template: require('../views/createGroupModal.jade'),
                controller: 'CreateGroupModal'
            });
        };
    }
}
