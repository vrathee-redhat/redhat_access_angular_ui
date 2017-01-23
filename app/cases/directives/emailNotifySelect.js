'use strict';

export default function () {
    return {
        template: require('../views/emailNotifySelect.jade'),
        restrict: 'A',
        transclude: true,
        controller: 'EmailNotifySelect',
        scope: {
            internal: '='
        },
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
