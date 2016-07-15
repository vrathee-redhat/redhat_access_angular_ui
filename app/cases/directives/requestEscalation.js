'use strict';

export default function () {
    return {
        template: require('../views/requestEscalation.jade'),
        restrict: 'A',
        controller: 'RequestEscalation'
    };
}
