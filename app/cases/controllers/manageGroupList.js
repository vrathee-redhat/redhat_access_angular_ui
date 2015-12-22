'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ManageGroupList', [
    '$scope',
    'securityService',
    'ManageGroupsService',
    'RHAUtils',
    'translate',
    function ($scope, securityService, ManageGroupsService, RHAUtils, translate) {
        $scope.securityService = securityService;
        $scope.ManageGroupsService = ManageGroupsService;
        $scope.groupsLoading = true;
        $scope.isGroupPrestine = true;
        $scope.showCreateGroup = false;
        $scope.newGroupName = '';
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

        $scope.toggleActiveButton = function(group) {

            group.active=!group.active;
        };

        $scope.fetchGroupDetails = function(group) {
            ManageGroupsService.fetchGroupDetails(group);
        };

        $scope.createGroup = function() {
            if (RHAUtils.isEmpty(ManageGroupsService.newGroupName)) {
                ManageGroupsService.newGroupName = 'Untitled Case Group';
            }
            ManageGroupsService.createGroup();
        };

        $scope.addNewGroup = function() {
            if ($scope.showCreateGroup === true) {
                $scope.showCreateGroup = false;
            } else {
                $scope.showCreateGroup = true;
            }
        };

        $scope.groupAction = function(group,action) {
            if(action === 'delete') {
                group.active=false;
                group.deleteCaseGroup = true;
                group.renameCaseGroup = false;
            }  else if (action === 'rename') {
                group.originalName = group.name;
                group.active=false;
                group.renameCaseGroup = true;
                group.deleteCaseGroup = false;
            } else if (action === 'duplicate') {
                group.active=false;
                group.renameCaseGroup = false;
                group.deleteCaseGroup = false;
                $scope.showCreateGroup = true;
                ManageGroupsService.newGroupName = group.name + ' Duplicate';
            }
        };

        $scope.selectedGroup = function(group) {
            var isSelected = (group.name === ManageGroupsService.selectedGroup.name);

            if (isSelected) {
                return 'selected-group';
            }
            return '';
        };

        $scope.deleteGroup = function(group) {
            ManageGroupsService.deleteGroup(group);
        };

        $scope.renameGroup = function(group) {
            group.updatingDetails = true;
            ManageGroupsService.saveGroup(group,undefined).then(function(){
                group.renameCaseGroup = false;
                group.updatingDetails = false;
            });
        };

        $scope.cancel = function(group) {
            if(group.deleteCaseGroup === true) {
                group.deleteCaseGroup = false;
            }
            if(group.renameCaseGroup === true) {
                group.name = group.originalName;
                group.renameCaseGroup = false;
            }
        };

    }
]);
