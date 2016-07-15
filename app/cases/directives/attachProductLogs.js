'use strict';

export default function () {
    return {
        template: require('../views/attachProductLogs.jade'),
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
        }
    };
}
