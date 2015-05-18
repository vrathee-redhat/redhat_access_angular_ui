'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.ascension').directive('rhaInternalcasedescription', function () {
    return {
        templateUrl: 'ascension/views/caseDescription.html',
        restrict: 'A',
        scope: { loading: '=' },
        controller: 'CaseDescription',
        link: function postLink(scope, element, attrs) {
        }
    };
});
