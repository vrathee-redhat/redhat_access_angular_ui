'use strict';

import _ from 'lodash'

export default class ManageGroupList {
    constructor($scope, securityService, ManageGroupsService, RHAUtils, translate) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.ManageGroupsService = ManageGroupsService;
        $scope.groupsLoading = true;
        $scope.isGroupPrestine = true;
        $scope.showCreateGroup = false;
        $scope.groupNameValid = false;
        $scope.renameCaseGroup = false;
        $scope.actionOptions = [
            {
                value: 'rename',
                label: translate('Rename')
            },
            {
                value: 'delete',
                label: translate('Delete')
            },
            {
                value: 'duplicate',
                label: translate('Duplicate')
            }
        ];

        $scope.checkGroupName = () => {
            $scope.groupNameValid = RHAUtils.isNotEmpty(ManageGroupsService.newGroupName) && !_.find(ManageGroupsService.groupsOnScreen, {name: ManageGroupsService.newGroupName});            
        };

        $scope.toggleActiveButton = function (group) {
            group.active = !group.active;
        };

        $scope.fetchGroupDetails = function (group) {
            ManageGroupsService.fetchGroupDetails(group);
        };

        $scope.createGroup = function () {
            if($scope.groupNameValid) {
                ManageGroupsService.createGroup();
            }
        };

        $scope.addNewGroup = function () {
            $scope.showCreateGroup = !$scope.showCreateGroup;
        };

        $scope.groupAction = function (group, action) {
            if (action === 'delete') {
                group.active = false;
                group.deleteCaseGroup = true;
                group.renameCaseGroup = false;
            } else if (action === 'rename') {
                group.originalName = group.name;
                group.active = false;
                group.renameCaseGroup = true;
                group.deleteCaseGroup = false;
            } else if (action === 'duplicate') {
                group.active = false;
                group.renameCaseGroup = false;
                group.deleteCaseGroup = false;
                $scope.showCreateGroup = true;
                ManageGroupsService.newGroupName = group.name + ' Duplicate';
            }
        };

        $scope.selectedGroup = function (group) {
            var isSelected = (group.name === ManageGroupsService.selectedGroup.name);

            if (isSelected) {
                return 'selected-group';
            }
            return '';
        };

        $scope.deleteGroup = function (group) {
            ManageGroupsService.deleteGroup(group).then(function () {
                if (RHAUtils.isNotEmpty(ManageGroupsService.groupsOnScreen) && ManageGroupsService.groupsOnScreen.length > 0) {
                    ManageGroupsService.fetchGroupDetails(ManageGroupsService.groupsOnScreen[0]);
                }
            });
        };

        $scope.renameGroup = function (group) {
            group.updatingDetails = true;
            ManageGroupsService.saveGroup(group, undefined).then(function () {
                group.renameCaseGroup = false;
                group.updatingDetails = false;
            });
        };

        $scope.cancel = function (group) {
            if (group.deleteCaseGroup === true) {
                group.deleteCaseGroup = false;
            }
            if (group.renameCaseGroup === true) {
                group.name = group.originalName;
                group.renameCaseGroup = false;
            }
        };

    }
}
