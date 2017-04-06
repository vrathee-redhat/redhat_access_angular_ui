'use strict';

export default {
    template: require('../views/managedAccountSelect.jade')(),
    controller: 'ManagedAccountSelect',
    bindings: {
    	selectedAccount: '=',
    	selectedAccountChanged: '&'
    }
}
