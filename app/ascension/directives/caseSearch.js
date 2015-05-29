'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCasesearch', function () {
    return {
        templateUrl: 'ascension/views/caseSearch.html',
        restrict: 'A',
        controller: 'CaseSearch'
    };
});