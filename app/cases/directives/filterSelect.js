'use strict';

export default function () {
    return {
        template: require('../views/filterSelect.jade'),
        restrict: 'A',
        controller: 'FilterSelect',
        scope: {
            onchange: '&'
        }
    };
}
