'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaFilterselect', function () {
    return {
        templateUrl: 'cases/views/filterSelect.html',
        restrict: 'A',
        controller: 'FilterSelect',
        scope: {
            onchange: '&'
        }
    };
});