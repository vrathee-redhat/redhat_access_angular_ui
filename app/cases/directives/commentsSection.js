'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCasecomments', function () {
    return {
        templateUrl: 'cases/views/commentsSection.html',
        controller: 'CommentsSection',
        scope: { loading: '=' },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
        }
    };
});
