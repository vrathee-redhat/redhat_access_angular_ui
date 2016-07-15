'use strict';

export default class AccountService {
    constructor(strataService, AlertService) {
        'ngInject';

        this.accounts = {};

        this.loadAccount = function (accountNumber, addErrorOnFail) {
            if (addErrorOnFail == null) addErrorOnFail = true;

            return strataService.accounts.get(accountNumber).then(angular.bind(this, function (account) {
                this.accounts[accountNumber] = account;
            }), function (error) {
                if (addErrorOnFail) {
                    AlertService.addStrataErrorMessage(error);
                }
            })
        };
    }
}
