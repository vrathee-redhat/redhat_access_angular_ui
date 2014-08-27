'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaSeverityselect', function () {
    return {
        templateUrl: 'cases/views/severitySelect.html',
        restrict: 'A',
        controller: 'SeveritySelect',
        scope: { onchange: '&' }
    };
});