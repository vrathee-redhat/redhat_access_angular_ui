'use strict';
angular.module('RedhatAccess.cases').service('AccountService', [
    'strataService',
    'AlertService',
    function(strataService, AlertService) {
        this.accounts = {};

        this.loadAccount = function (accountNumber) {
            return strataService.accounts.get(accountNumber).then(angular.bind(this, function (account) {
                this.accounts[accountNumber] = account;
            }), function (error) {
                AlertService.addStrataErrorMessage(error);
            })
        };
    }
]);
