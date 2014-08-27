'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCaserecommendations', function () {
    return {
        templateUrl: 'cases/views/recommendationsSection.html',
        restrict: 'A',
        controller: 'RecommendationsSection',
        scope: { loading: '=' },
        link: function postLink(scope, element, attrs) {
        }
    };
});