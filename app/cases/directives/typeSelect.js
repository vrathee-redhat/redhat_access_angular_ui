'use strict';

export default function () {
    return {
        template: require('../views/typeSelect.jade'),
        restrict: 'A',
        controller: 'TypeSelect',
        scope: {onchange: '&'}
    };
}
