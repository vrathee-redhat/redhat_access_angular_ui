'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCasedetails', function () {
    return {
        templateUrl: 'cases/views/detailsSection.html',
        controller: 'DetailsSection',
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