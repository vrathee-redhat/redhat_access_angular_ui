'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCasesummary', function () {
    return {
        templateUrl: 'ascension/views/caseSummary.html',
        restrict: 'A',
        controller: 'CaseSummary'
    };
});