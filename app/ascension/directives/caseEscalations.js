'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCaseescalations', function () {
    return {
        templateUrl: 'ascension/views/caseEscalations.html',
        restrict: 'A',
        controller: 'CaseEscalations'
    };
});