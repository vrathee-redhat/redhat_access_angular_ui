'use strict';
angular.module('RedhatAccess.cases').controller('BookmarkedAccountSelect', [
    '$scope',
    'securityService',
    'AUTH_EVENTS',
    'AccountService',
    'RHAUtils',
    function ($scope, securityService, AUTH_EVENTS, AccountService, RHAUtils) {
        $scope.loading = true;
        $scope.accountOptions = [];

        var init = function () {
            var user = securityService.loginStatus.authedUser;
            if(RHAUtils.isNotEmpty(user.account_list) && RHAUtils.isNotEmpty(user.account_list.account_number)) {
                var accountPromises = user.account_list.account_number.map(function (number) {
                    return AccountService.loadAccount(number);
                });
                Promise.all(accountPromises).then(function () {
                    $scope.buildOptions();
                    $scope.loading = false;
                }, function () {
                    $scope.loading = false;
                });
            } else {
                $scope.loading = false;
            }
        };

        $scope.buildOptions = function () {
            var user = securityService.loginStatus.authedUser;
            $scope.accountOptions = [];
            user.account_list.account_number.forEach(function (number) {
                var account = AccountService.accounts[number];
                $scope.accountOptions.push({
                    value: number,
                    label: '(' + account.number + ') ' + account.name
                });
            })
        };

        $scope.$watch('selectedAccount', function () {
            $scope.selectedAccountChanged();
        });

        if (securityService.loginStatus.isLoggedIn) {
            init();
        }

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            init();
        });
    }
]);
