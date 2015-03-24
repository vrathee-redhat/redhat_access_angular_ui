/*global angular*/
'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaTopcases', function () {
    return {
        templateUrl: 'ascension/views/topCases.html',
        restrict: 'A',
        controller: 'TopCases',
        scope: {
            prefilter: '=',
            postfilter: '='
        },
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});
