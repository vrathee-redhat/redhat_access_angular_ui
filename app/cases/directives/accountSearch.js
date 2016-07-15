'use strict';

export default function () {
    return {
        template: require('../views/accountSearch.jade'),
        controller: 'AccountSearch',
        restrict: 'A',
        scope: {}
    };
}
