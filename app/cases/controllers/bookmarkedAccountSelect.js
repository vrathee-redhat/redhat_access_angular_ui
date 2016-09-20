'use strict';

export default class BookmarkedAccountSelect {
    constructor($scope, AccountBookmarkService, ACCOUNT_EVENTS) {
        'ngInject';

        $scope.loading = true;
        $scope.accountOptions = [];

        let init = function () {
            $scope.buildOptions();
        };

        $scope.isLoading = function () {
            return AccountBookmarkService.loading;
        };

        $scope.buildOptions = function () {
            if (!AccountBookmarkService.loading) {
                $scope.accountOptions = [];
                AccountBookmarkService.bookmarkedAccounts.forEach(function (account) {
                    $scope.accountOptions.push({
                        value: account.number,
                        label: '(' + account.number + ') ' + account.name
                    });
                })
            }
        };

        $scope.$watch('selectedAccount', function (newValue, oldValue) {
            if(newValue != oldValue) {
                $scope.selectedAccountChanged();
            }
        });

        if (!AccountBookmarkService.loading) {
            init();
        } else {
            $scope.$on(ACCOUNT_EVENTS.bookmarkedAccountsFetched, angular.bind(this, init));
        }
    }
}
