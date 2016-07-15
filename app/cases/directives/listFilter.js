'use strict';

export default function () {
    return {
        template: require('../views/listFilter.jade'),
        restrict: 'A',
        controller: 'ListFilter',
        scope: {
            prefilter: '=',
            postfilter: '='
        },
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
