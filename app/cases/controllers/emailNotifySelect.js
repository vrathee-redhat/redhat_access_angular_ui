'use strict';

export default class EmailNotifySelect {
    constructor($scope, CaseService, securityService, AlertService, strataService, CASE_EVENTS, $filter, RHAUtils, EDIT_CASE_CONFIG) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.showEmailNotifications = EDIT_CASE_CONFIG.showEmailNotifications;
        $scope.selectedUsers = [];
        $scope.saving = false;

        $scope.selectedUsersChanged = () => {
            const allUsers = $scope.internal ? CaseService.redhatUsers : CaseService.users;
            const previouslySelectedUsers = _.intersection(CaseService.originalNotifiedUsers, _.map(allUsers, 'sso_username'));
            // ignore the case contact, we never want to add/remove notifications for him
            const toBeAdded = _.without(_.difference($scope.selectedUsers, previouslySelectedUsers), CaseService.kase.contact_sso_username);
            const toBeRemoved = _.without(_.difference(previouslySelectedUsers, $scope.selectedUsers), CaseService.kase.contact_sso_username);

            $scope.saving = true;

            const addPromises = _.map(toBeAdded, (user) => strataService.cases.notified_users.add(CaseService.kase.case_number, user));
            const removePromises = _.map(toBeRemoved, (user) => strataService.cases.notified_users.remove(CaseService.kase.case_number, user));

            Promise.all([...addPromises, ...removePromises]).then(() => {
                _.pullAll(CaseService.originalNotifiedUsers, toBeRemoved);
                CaseService.originalNotifiedUsers = CaseService.originalNotifiedUsers.concat(toBeAdded);
                $scope.saving = false;
            });
        };

        $scope.mapUsers = (users) => _.compact(_.map(users, (userSSO) => _.find($scope.internal ? CaseService.redhatUsers : CaseService.users, {'sso_username': userSSO})));

        $scope.removeUser = (userSSO) => {
            if($scope.saving) return;

            _.pull($scope.selectedUsers, userSSO);
            $scope.selectedUsersChanged();
        };

        $scope.searchRHUsers = (searchQuery) => {
            const query = searchQuery.toLowerCase();

            return _.filter(CaseService.redhatUsers, (user) => `${user.first_name} ${user.last_name} ${user.sso_username}`.toLowerCase().indexOf(query) > -1);
        };

        $scope.isCurrentUserWatcher = () => $scope.selectedUsers.indexOf(securityService.loginStatus.authedUser.sso_username) > -1;

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

            if(!$scope.internal) {
                CaseService.populateUsers().then(() => {
                    $scope.$watch('CaseService.originalNotifiedUsers', () => setUsers(CaseService.users, CaseService.originalNotifiedUsers));
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
        })
    }
}
