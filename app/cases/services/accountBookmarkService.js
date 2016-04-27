'use strict';
angular.module('RedhatAccess.cases').service('AccountBookmarkService', [
    'securityService',
    '$rootScope',
    'AUTH_EVENTS',
    'AccountService',
    'RHAUtils',
    'ACCOUNT_EVENTS',
    'strataService',
    '$timeout',
    function (securityService, $rootScope, AUTH_EVENTS, AccountService, RHAUtils, ACCOUNT_EVENTS, strataService, $timeout) {
        this.loading = true;
        this.bookmarkedAccounts = [];

        this.init = function () { // load the bookmarked accounts from the logged in user.
            var user = securityService.loginStatus.authedUser;
            if(RHAUtils.isNotEmpty(user.account_list) && RHAUtils.isNotEmpty(user.account_list.account_number)) {
                this.loading = true;
                var accountPromises = user.account_list.account_number.map(function (number) {
                    return AccountService.loadAccount(number);
                });
                return Promise.all(accountPromises).then(angular.bind(this, function () {
                    this.bookmarkedAccounts = user.account_list.account_number.map(function (number) {
                        return AccountService.accounts[number];
                    }).filter(function (account) {
                        return account != null; // remove accounts not found
                    });
                    this.loading = false;
                    this.bookmarkedAccounts.sort(function (a, b) {
                        if(a.name < b.name) return -1;
                        if(a.name > b.name) return 1;
                        return 0;
                    });
                    $rootScope.$broadcast(ACCOUNT_EVENTS.bookmarkedAccountsFetched);
                }), angular.bind(this, function () {
                    this.loading = false;
                    $rootScope.$broadcast(ACCOUNT_EVENTS.bookmarkedAccountsFetched);
                }));
            } else {
                this.bookmarkedAccounts = [];
                this.loading = false;
                $rootScope.$broadcast(ACCOUNT_EVENTS.bookmarkedAccountsFetched);
                return Promise.resolve();
            }
        };

        this.isBookmarked = function (accountNumber) {
            return this.bookmarkedAccounts.filter(function (account) {
                    return account.number === accountNumber;
                }).length > 0;
        };

        this.addBookmark = function (account) {
            var user = securityService.loginStatus.authedUser;
            return strataService.accounts.addBookmark(account.number, user.sso_username).then(angular.bind(this,function () {
                this.bookmarkedAccounts.push(account);
            }));
        };

        this.removeBookmark = function (account) {
            var user = securityService.loginStatus.authedUser;
            return strataService.accounts.removeBookmark(account.number, user.sso_username).then(angular.bind(this, function () {
                this.bookmarkedAccounts = this.bookmarkedAccounts.filter(function (bAcc) {
                    return bAcc.number != account.number;
                });
            }));
        };

        if(securityService.loginStatus.isLoggedIn) {
            this.init().then(function () {
                $rootScope.$apply(); // digest needs to be manually invoked, since this runs outside of scope apply
            });
        }

        $rootScope.$on(AUTH_EVENTS.loginSuccess, angular.bind(this, function () {
            this.init().then(function () {
                $rootScope.$apply(); // digest needs to be manually invoked, since this runs outside of scope apply
            })
        }));
    }
]);
