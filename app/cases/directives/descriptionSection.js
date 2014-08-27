'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCasedescription', function () {
    return {
        templateUrl: 'cases/views/descriptionSection.html',
        restrict: 'A',
        scope: { loading: '=' },
        controller: 'DescriptionSection',
        link: function postLink(scope, element, attrs) {
        }
    };
});