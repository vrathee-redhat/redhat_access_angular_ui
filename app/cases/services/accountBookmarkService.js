'use strict';
angular.module('RedhatAccess.cases').service('AccountBookmarkService', [
    'securityService',
    '$rootScope',
    'AUTH_EVENTS',
    'AccountService',
    'RHAUtils',
    'ACCOUNT_EVENTS',
    'strataService',
    '$q',
    function (securityService, $rootScope, AUTH_EVENTS, AccountService, RHAUtils, ACCOUNT_EVENTS, strataService, $q) {
        this.loading = true;
        this.bookmarkedAccounts = [];

        this.init = function () { // load the bookmarked accounts from the logged in user.
            var user = securityService.loginStatus.authedUser;
            if(RHAUtils.isNotEmpty(user.account_list) && RHAUtils.isNotEmpty(user.account_list.account_number)) {
                this.loading = true;
                var accountPromises = user.account_list.account_number.map(function (number) {
                    return AccountService.loadAccount(number);
                });
                $q.all(accountPromises).then(angular.bind(this, function () {
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
                if(RHAUtils.isNotEmpty(account.name)) {
                    this.bookmarkedAccounts.push(account);
                } else { //there is no name, we must fetch the account before adding to bookmarked accounts
                    if(RHAUtils.isNotEmpty(AccountService.accounts[account.number])) { // was it already fetched before?
                        this.bookmarkedAccounts.push(AccountService.accounts[account.number]);
                    } else {
                        return AccountService.loadAccount(account.number).then(angular.bind(this, function () {
                            if(RHAUtils.isNotEmpty(AccountService.accounts[account.number])) {
                                this.bookmarkedAccounts.push(AccountService.accounts[account.number]);
                            }
                        }));
                    }
                }

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
            this.init();
        }

        $rootScope.$on(AUTH_EVENTS.loginSuccess, angular.bind(this, function () {
            this.init();
        }));
    }
]);
