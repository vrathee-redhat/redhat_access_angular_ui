'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCasehistory', function () {
    return {
        templateUrl: 'ascension/views/caseHistory.html',
        restrict: 'A',
        controller: 'CaseHistory'
    };
});