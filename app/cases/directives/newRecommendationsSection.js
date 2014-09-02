'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewrecommendations', function () {
    return {
        templateUrl: 'cases/views/newRecommendationsSection.html',
        restrict: 'A',
        controller: 'SearchController',
        transclude: true,
        scope: { loading: '=' },
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});