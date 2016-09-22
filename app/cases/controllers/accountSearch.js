'use strict';

export default class AccountSearch {
    constructor($scope, AccountService, $timeout, RHAUtils) {
        'ngInject';

        $scope.accountQuery = '';
        $scope.account = null;

        $scope.invalid = false;
        $scope.valid = false;
        $scope.loading = false;

        $scope.loadAccount = function () {
            if (RHAUtils.isEmpty($scope.accountQuery) || $scope.accountQuery.trim().length === 0) {
                $scope.invalid = false;
                $scope.valid = false;
                $scope.loading = false;
                $scope.account = null;
                return;
            }

            $scope.invalid = false;
            $scope.valid = false;
            $scope.loading = true;

            var number = $scope.accountQuery.trim();
            AccountService.loadAccount(number, false).then(function () {
                if (AccountService.accounts[number] != null) {
                    if (AccountService.accounts[number].number == $scope.accountQuery.trim()) {
                        $scope.account = AccountService.accounts[number];
                        $scope.valid = true;
                        $scope.invalid = false;
                    }
                    $scope.loading = false;
                } else {
                    if (number == $scope.accountQuery.trim()) {
                        $scope.account = null;
                        $scope.invalid = true;
                        $scope.valid = false;
                    }
                    $scope.loading = false;
                }
            });
        };

        $scope.queryChanged = function () {
            $scope.loadAccount();
        }
    }
}
