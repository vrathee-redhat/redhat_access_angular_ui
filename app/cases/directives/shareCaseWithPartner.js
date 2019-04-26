'use strict';

export default function () {
    return {
        template: require('../views/shareCaseWithPartner.jade'),
        restrict: 'AE',
        transclude: true,
        controller: 'ShareCaseWithPartner',
        scope: {},
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
