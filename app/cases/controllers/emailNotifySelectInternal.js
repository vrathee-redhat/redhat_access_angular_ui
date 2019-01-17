'use strict';

import _ from 'lodash';
import hydrajs  from '../../shared/hydrajs';

export default class EmailNotifySelectInternal {
    constructor($scope, CaseService, securityService, AlertService, strataService, CASE_EVENTS, $filter, RHAUtils, EDIT_CASE_CONFIG, gettextCatalog) {
        'ngInject';
        $scope.isLoadingContacts = false;
        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.showEmailNotifications = EDIT_CASE_CONFIG.showEmailNotifications;
        $scope.selectedUsers = [];
        $scope.saving = false;
        $scope.RHAUtils = RHAUtils;
        $scope.contactToAdd = undefined;

        const submitWatchers = (toBeAdded, toBeRemoved, removed) => {
            const addPromises = _.map(toBeAdded, (user) => strataService.cases.notified_users.add(CaseService.kase.case_number, user));
            const removePromises = _.map(toBeRemoved, (user) => strataService.cases.notified_users.remove(CaseService.kase.case_number, user));

            return Promise.all([...addPromises, ...removePromises]).then(() => {
                _.pullAll(CaseService.originalNotifiedUsers, toBeRemoved);
                CaseService.originalNotifiedUsers = CaseService.originalNotifiedUsers.concat(toBeAdded);
                if ($scope.contactToAdd && toBeAdded && toBeAdded.length > 0) {
                    CaseService.internalNotificationContacts = CaseService.internalNotificationContacts.concat($scope.contactToAdd);
                }
                if (toBeRemoved && toBeRemoved.length > 0) {
                    CaseService.internalNotificationContacts = _.filter(CaseService.internalNotificationContacts, (contact) => !_.includes(toBeRemoved, contact.ssoUsername));
                }
                $scope.selectedUsers = CaseService.originalNotifiedUsers;
                $scope.saving = false;
                // add warning message for users we cannot add
                _.each(removed, (sso)=> AlertService.addWarningMessage(gettextCatalog.getString('User {{sso}} cannot be added as watcher because it is not internal.', {sso})));
            });
        }

        $scope.selectedUsersChanged = () => {
            const previouslySelectedUsers = _.intersection(CaseService.originalNotifiedUsers, _.map(CaseService.internalNotificationContacts, 'ssoUsername'));
            // ignore the case contact, we never want to add/remove notifications for him
            const toBeAdded = _.without(_.difference($scope.selectedUsers, previouslySelectedUsers), CaseService.kase.contact_sso_username);
            const toBeRemoved = _.without(_.difference(previouslySelectedUsers, $scope.selectedUsers), CaseService.kase.contact_sso_username);
            $scope.saving = true;
            const internalSSOs = _.map(_.filter([$scope.contactToAdd], 'isInternal'), 'ssoUsername');
            // remove non-internal users
            const removed = _.remove(toBeAdded, (userSSO) => internalSSOs.indexOf(userSSO) == -1);
            return submitWatchers(toBeAdded, toBeRemoved, removed);
        };


        $scope.mapUsers = (users) => _.compact(_.map(users, (userSSO) => _.find(CaseService.internalNotificationContacts, {'ssoUsername': userSSO})));

        $scope.removeUser = (userSSO) => {
            if($scope.saving) return;

            _.pull($scope.selectedUsers, userSSO);
            $scope.selectedUsersChanged();
        };

        $scope.searchRHUsers = async (searchQuery) => {
            if (searchQuery && searchQuery.length < 4) return [];
            let queryParams = {
                limit: 10,
                internal: false, // to get non-ldap contacts 
                isInternalContact: true,
                nameLookup: searchQuery || ''
            }
            let options = [];
            try {
                $scope.isLoadingContacts = true;
                const response = await hydrajs.contacts.getSFDCContacts(queryParams);
                options = (response && response.items && response.items.length) ? response.items : [];
                $scope.isLoadingContacts = false;
            } catch (e) {
                console.warn(`Unable to search contacts, error: ${e}`);
                $scope.isLoadingContacts = false;
            }
            return options;
        };

        $scope.isCurrentUserWatcher = () => $scope.selectedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) > -1;
        $scope.isCurrentUserCaseContact = () => CaseService.kase.contact_sso_username == securityService.loginStatus.authedUser.sso_username;

        $scope.toggleCurrentUser = () => {
            if($scope.isCurrentUserWatcher()) {
                _.pull($scope.selectedUsers, securityService.loginStatus.authedUser.sso_username);
                $scope.selectedUsersChanged();
            } else {
                $scope.contactToAdd = {
                    ssoUsername: securityService.loginStatus.authedUser.sso_username,
                    firstName: securityService.loginStatus.authedUser.first_name,
                    lastName: securityService.loginStatus.authedUser.last_name,
                    isInternal: securityService.loginStatus.authedUser.is_internal,
                    orgAdmin: securityService.loginStatus.authedUser.org_admin
                }
                $scope.selectedUsers.push(securityService.loginStatus.authedUser.sso_username);
                $scope.selectedUsersChanged();
            }
        };

        const init = () => {
            $scope.$watch('CaseService.originalNotifiedUsers', () => $scope.selectedUsers = _.cloneDeep(CaseService.originalNotifiedUsers));
        };

        if (CaseService.caseDataReady) {
            init();
        }
        $scope.$on(CASE_EVENTS.received, () => {
            init();
        });

        $scope.$watch('userToAdd', (user) => {
            if(_.isObject(user)) { // user is object if it was selected from the options, otherwise it's string
                $scope.contactToAdd = user;
                $scope.selectedUsers.push(user.ssoUsername);
                $scope.selectedUsersChanged();
                $scope.userToAdd = '';
            }
        });
    }
}
