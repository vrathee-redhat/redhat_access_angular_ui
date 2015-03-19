'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewrecommendations', function () {
    return {
        templateUrl: 'cases/views/newRecommendationsSection.html',
        restrict: 'A',
        controller: 'PcmRecommendationsController',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});