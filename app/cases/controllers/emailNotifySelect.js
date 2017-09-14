'use strict';

import _ from 'lodash';

export default class EmailNotifySelect {
    constructor($scope, CaseService, securityService, AlertService, strataService, CASE_EVENTS, $filter, RHAUtils, EDIT_CASE_CONFIG, gettextCatalog) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.showEmailNotifications = EDIT_CASE_CONFIG.showEmailNotifications;
        $scope.selectedUsers = [];
        $scope.saving = false;
        $scope.usersOnAccount = [];
        $scope.RHAUtils = RHAUtils;

        $scope.selectedUsersChanged = () => {
            const allUsers = $scope.internal ? CaseService.redhatUsers : CaseService.users;
            const previouslySelectedUsers = _.intersection(CaseService.originalNotifiedUsers, _.map(allUsers, 'sso_username'));
            // ignore the case contact, we never want to add/remove notifications for him
            const toBeAdded = _.without(_.difference($scope.selectedUsers, previouslySelectedUsers), CaseService.kase.contact_sso_username);
            const toBeRemoved = _.without(_.difference(previouslySelectedUsers, $scope.selectedUsers), CaseService.kase.contact_sso_username);

            $scope.saving = true;

            function submitWatchers(toBeAdded, toBeRemoved, removed) {
                const addPromises = _.map(toBeAdded, (user) => strataService.cases.notified_users.add(CaseService.kase.case_number, user));
                const removePromises = _.map(toBeRemoved, (user) => strataService.cases.notified_users.remove(CaseService.kase.case_number, user));

                return Promise.all([...addPromises, ...removePromises]).then(() => {
                    _.pullAll(CaseService.originalNotifiedUsers, toBeRemoved);
                    CaseService.originalNotifiedUsers = CaseService.originalNotifiedUsers.concat(toBeAdded);
                    $scope.saving = false;

                    // add warning message for users we cannot add
                    _.each(removed, (sso)=> AlertService.addWarningMessage(gettextCatalog.getString('User {{sso}} cannot be added as watcher because it is not internal.', {sso})));
                });
            }

            if($scope.internal) {
                // fetch user info for all users to be added
                return Promise.all(_.map(toBeAdded, (user) => strataService.users.getBySSO(user))).then((users) => {
                    const internalSSOs = _.map(_.filter(users, 'is_internal'), 'sso_username');

                    // remove non-internal users
                    const removed = _.remove(toBeAdded, (userSSO) => internalSSOs.indexOf(userSSO) == -1);

                    return submitWatchers(toBeAdded, toBeRemoved, removed);
                });
            } else {
                return submitWatchers(toBeAdded, toBeRemoved, []);
            }
        };


        $scope.mapUsers = (users) => _.compact(_.map(users, (userSSO) => _.find($scope.internal ? CaseService.redhatUsers : CaseService.users, {'sso_username': userSSO})));

        $scope.removeUser = (userSSO) => {
            if($scope.saving) return;

            _.pull($scope.selectedUsers, userSSO);
            $scope.selectedUsersChanged();
        };

        $scope.searchRHUsers = (searchQuery) => {
            const query = searchQuery.toLowerCase();

            // return users that are not selected and match the searchQuery
            return _.filter(CaseService.redhatUsers, (user) => $scope.selectedUsers.indexOf(user.sso_username) == -1 && `${user.first_name} ${user.last_name} ${user.sso_username}`.toLowerCase().indexOf(query) > -1);
        };

        $scope.isCurrentUserWatcher = () => $scope.selectedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) > -1;
        $scope.isCurrentUserCaseContact = () => CaseService.kase.contact_sso_username == securityService.loginStatus.authedUser.sso_username;
        $scope.isCurrentUserNotifiedUser = () => _.includes(CaseService.originalNotifiedUsers, securityService.loginStatus.authedUser.sso_username);

        $scope.toggleCurrentUser = () => {
            if($scope.isCurrentUserWatcher()) {
                _.pull($scope.selectedUsers, securityService.loginStatus.authedUser.sso_username);
                $scope.selectedUsersChanged();
            } else {
                $scope.selectedUsers.push(securityService.loginStatus.authedUser.sso_username);
                $scope.selectedUsersChanged();
            }
        };

        const init = () => {
            function setUsers(allUsers, selectedUsers) {
                $scope.selectedUsers =  _.intersection(_.map(allUsers, 'sso_username'), selectedUsers);
                $scope.selectedUsers.unshift(CaseService.kase.contact_sso_username); // fake insert the Case Contact
            }

            if(securityService.loginStatus.authedUser.org_admin || securityService.loginStatus.authedUser.is_internal) {
                $scope.usersOnAccount = _.cloneDeep(CaseService.users);
                $scope.usersOnAccount = $scope.usersOnAccount.concat(securityService.loginStatus.authedUser.accountContacts);
                $scope.usersOnAccount = _.uniqBy($scope.usersOnAccount,'sso_username');
            } else {
                $scope.usersOnAccount = _.cloneDeep(CaseService.users);
            }

            if(!$scope.internal) {
                CaseService.populateUsers().then(() => {
                    $scope.$watch('CaseService.originalNotifiedUsers', () => setUsers($scope.usersOnAccount, CaseService.originalNotifiedUsers));
                });
            } else {
                if(RHAUtils.isEmpty(CaseService.redhatUsers)) { // RH Users are not loaded yet
                    CaseService.populateRedhatUsers().then(() => $scope.$watch('CaseService.originalNotifiedUsers', () => setUsers(CaseService.redhatUsers, CaseService.originalNotifiedUsers)));
                } else {
                    $scope.$watch('CaseService.originalNotifiedUsers', () => setUsers(CaseService.redhatUsers, CaseService.originalNotifiedUsers));
                }
            }
        };

        if (CaseService.caseDataReady) {
            init();
        }
        $scope.$on(CASE_EVENTS.received, () => {
            init();
        });

        $scope.$watch('userToAdd', (user) => {
            if(_.isObject(user)) { // user is object if it was selected from the options, otherwise it's string
                $scope.selectedUsers.push(user.sso_username);
                $scope.selectedUsersChanged();
                $scope.userToAdd = '';
            }
        });

        $scope.$watch('CaseService.users', function () {
            if(securityService.loginStatus.authedUser.org_admin || securityService.loginStatus.authedUser.is_internal) {
                $scope.usersOnAccount = _.cloneDeep(CaseService.users);
                $scope.usersOnAccount = $scope.usersOnAccount.concat(securityService.loginStatus.authedUser.accountContacts);
                $scope.usersOnAccount = _.uniqBy($scope.usersOnAccount,'sso_username');
            } else {
                $scope.usersOnAccount = _.cloneDeep(CaseService.users);
            }
        });
    }
}
