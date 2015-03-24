'use strict';
angular.module('RedhatAccess.cases').directive('rhaBreachinformation', function () {
    return {
        templateUrl: 'ascension/views/breachInformation.html',
        restrict: 'A',
        controller: 'BreachInformation'
    };
});
