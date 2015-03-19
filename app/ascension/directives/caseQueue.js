'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCaseQueue', function () {
    return {
        templateUrl: 'ascension/views/caseQueue.html',
        restrict: 'A',
        controller: 'CaseQueue'
    };
});