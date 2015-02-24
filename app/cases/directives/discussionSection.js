'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCasediscussion', ['$location','$anchorScroll' ,function ($location, $anchorScroll) {
    return {
        templateUrl: 'cases/views/discussionSection.html',
        controller: 'DiscussionSection',
        scope: { loading: '=' },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
}]);
