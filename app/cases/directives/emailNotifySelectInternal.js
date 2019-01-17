'use strict';

export default function () {
    return {
        template: require('../views/emailNotifySelectInternal.jade'),
        restrict: 'A',
        transclude: true,
        controller: 'EmailNotifySelectInternal',
        scope: {},
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
