'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.ascension').directive('rhaInternalcasediscussion', ['$location','$anchorScroll' ,function ($location, $anchorScroll) {
    return {
        templateUrl: 'ascension/views/caseDiscussion.html',
        controller: 'CaseDiscussion',
        scope: { loading: '=' },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
}]);
