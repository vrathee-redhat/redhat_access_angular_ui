'use strict';
angular.module('RedhatAccess.ascension').directive('rhaBreachstatus', function () {
    return {
        templateUrl: 'ascension/views/breachStatus.html',
        restrict: 'A',
        controller: 'BreachStatus'
    };
});
