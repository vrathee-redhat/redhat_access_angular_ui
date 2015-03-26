'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.ascension').directive('rhaInternalcasedetails', function () {
    return {
        templateUrl: 'ascension/views/internalCaseDetails.html',
        controller: 'InternalCaseDetails',
        scope: {
            compact: '=',
            loading: '='
        },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});
