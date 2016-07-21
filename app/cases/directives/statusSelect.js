'use strict';

export default function () {
    return {
        template: require('../views/statusSelect.jade'),
        restrict: 'A',
        controller: 'StatusSelect',
        scope: {onchange: '&'}
    };
}
