'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaInternalcasedescription', function () {
    return {
        templateUrl: 'ascension/views/internalCaseDescription.html',
        restrict: 'A',
        scope: { loading: '=' },
        controller: 'InternalCaseDescription',
        link: function postLink(scope, element, attrs) {
        }
    };
});
