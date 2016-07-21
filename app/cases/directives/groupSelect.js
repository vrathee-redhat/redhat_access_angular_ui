'use strict';

export default function () {
    return {
        template: require('../views/groupSelect.jade'),
        restrict: 'A',
        controller: 'GroupSelect',
        scope: {
            onchange: '&'
        }
    };
}
