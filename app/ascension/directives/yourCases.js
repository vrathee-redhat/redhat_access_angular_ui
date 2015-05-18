/*global angular*/
'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.ascension').directive('rhaYourcases', function () {
    return {
        templateUrl: 'ascension/views/yourCases.html',
        restrict: 'A',
        controller: 'YourCases',
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
