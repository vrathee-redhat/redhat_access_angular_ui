'use strict';

export default function () {
    return {
        template: require('../views/editCaseRecommendationsSection.jade'),
        restrict: 'A',
        controller: 'EditCaseRecommendationsController',
        transclude: true,
        scope: {loading: '='},
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
