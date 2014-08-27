'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaTypeselect', function () {
    return {
        templateUrl: 'cases/views/typeSelect.html',
        restrict: 'A',
        controller: 'TypeSelect',
        scope: { onchange: '&' }
    };
});