'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewcaserecommendationsalternate', function () {
    return {
        templateUrl: 'cases/views/newCaseRecommendationsAlternateSection.html',
        restrict: 'A',
        controller: 'NewCaseRecommendationsController',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});