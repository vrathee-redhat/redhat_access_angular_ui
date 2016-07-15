'use strict';

export default function () {
    return {
        template: require('../views/selectLoadingIndicator.jade'),
        restrict: 'A',
        transclude: true,
        scope: {
            loading: '=',
            type: '@'
        }
    };
}
