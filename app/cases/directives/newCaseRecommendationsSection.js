'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaNewcaserecommendations', function () {
    return {
        templateUrl: 'cases/views/newCaseRecommendationsSection.html',
        restrict: 'A',
        controller: 'NewCaseRecommendationsController',
        link: function postLink(scope, element, attrs) {
            scope.$watch( function() {
                return element.height();
            }, function() {
                window.chrometwo_require(['data-eh'], function(eh){
                    eh.apply('#rha-recommendation-section');
                });
            });
        }
    };
});