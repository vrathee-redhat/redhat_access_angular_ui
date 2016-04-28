'use strict';
angular.module('RedhatAccess.cases').controller('BookmarkedAccountSelect', [
    '$scope',
    'securityService',
    'AUTH_EVENTS',
    'AccountService',
    'RHAUtils',
    'AccountBookmarkService',
    'ACCOUNT_EVENTS',
    function ($scope, securityService, AUTH_EVENTS, AccountService, RHAUtils, AccountBookmarkService, ACCOUNT_EVENTS) {
        $scope.loading = true;
        $scope.accountOptions = [];

        var init = function () {
            $scope.buildOptions();
        };

        $scope.isLoading = function () {
            return AccountBookmarkService.loading;
        };

        $scope.buildOptions = function () {
            if(!AccountBookmarkService.loading) {
                $scope.accountOptions = [];
                AccountBookmarkService.bookmarkedAccounts.forEach(function (account) {
                    $scope.accountOptions.push({
                        value: account.number,
                        label: '(' + account.number + ') ' + account.name
                    });
                })
            }
        };

        $scope.$watch('selectedAccount', function () {
            $scope.selectedAccountChanged();
        });

        if (!AccountBookmarkService.loading) {
            init();
        } else {
            $scope.$on(ACCOUNT_EVENTS.bookmarkedAccountsFetched, angular.bind(this, init));
        }
    }
]);
