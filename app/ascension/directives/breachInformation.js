'use strict';
angular.module('RedhatAccess.ascension').directive('rhaBreachinformation', function () {
    return {
        templateUrl: 'ascension/views/breachInformation.html',
        restrict: 'A',
        controller: 'BreachInformation'
    };
});
