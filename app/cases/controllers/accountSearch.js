'use strict';
angular.module('RedhatAccess.cases').controller('AccountSearch', [
   '$scope',
    'AccountService',
    '$timeout',
    function ($scope, AccountService, $timeout) {
        var changeTimeout;
        $scope.accountQuery = '';
        $scope.account = null;

        $scope.invalid = false;
        $scope.valid = false;
        $scope.loading = false;

        $scope.loadAccount = function () {
            if($scope.accountQuery.trim().length === 0) {
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
                if(AccountService.accounts[number] != null) {
                    $scope.account = AccountService.accounts[number];
                    $scope.valid = true;
                    $scope.invalid = false;
                    $scope.loading = false;
                } else {
                    $scope.account = null;
                    $scope.invalid = true;
                    $scope.valid = false;
                    $scope.loading = false;
                }
            });
        };

        $scope.queryChanged = function () {
            if(changeTimeout != null) $timeout.cancel(changeTimeout);
            changeTimeout = $timeout($scope.loadAccount, 300);
        }
    }
]);
