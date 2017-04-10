'use strict';

export default class ManagedAccountSelect {
    constructor(securityService, $timeout) {
        'ngInject';
        this.securityService = securityService;
        this.$timeout = $timeout;
    }

    onAccountSelect() {
        this.$timeout(() => { // using $timeout cause of digest issue, if callback is used directly, then ng-model is not updated yet
            this.selectedAccountChanged({accountNumber: this.selectedAccount});
        });
    }
}
