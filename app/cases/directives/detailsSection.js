'use strict';

export default function () {
    return {
        template: require('../views/detailsSection.jade'),
        controller: 'DetailsSection',
        scope: {
            compact: '=',
            loading: '='
        },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
