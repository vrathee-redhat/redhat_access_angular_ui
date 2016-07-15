'use strict';

export default function () {
    return {
        template: require('../views/entitlementSelect.jade'),
        restrict: 'A',
        controller: 'EntitlementSelect'
    };
}
