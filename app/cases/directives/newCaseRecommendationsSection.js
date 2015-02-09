'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewcaserecommendations', function () {
    return {
        templateUrl: 'cases/views/newCaseRecommendationsSection.html',
        restrict: 'A',
        controller: 'NewCaseRecommendationsController',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});