'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaEditcaserecommendations', function () {
    return {
        templateUrl: 'cases/views/editCaseRecommendationsSection.html',
        restrict: 'A',
        controller: 'EditCaseRecommendationsController',
        transclude: true,
        scope: { loading: '=' },
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});
