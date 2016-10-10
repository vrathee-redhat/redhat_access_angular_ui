'use strict';

export default {
    template: require('../views/advancedSearchCaseList.jade')(),
    controller: 'AdvancedSearchCaseList',
    bindings: {
        cases: '<',
        offset: '<',
        limit: '<',
        loading: '<'
    }
}
