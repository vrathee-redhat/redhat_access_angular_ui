'use strict';

import {isEmpty,forEach} from 'lodash'

export default class ManagedAccountSelect {
    constructor(securityService) {
        'ngInject';
        this.securityService = securityService;
        this.selectedAccount = '';
    }
}
