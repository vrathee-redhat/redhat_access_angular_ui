'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.ascension').directive('rhaInternalcasedetails', function () {
    return {
        templateUrl: 'ascension/views/caseDetails.html',
        controller: 'CaseDetails',
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
