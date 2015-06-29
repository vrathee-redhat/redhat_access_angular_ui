'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCaseassociates', function () {
    return {
        templateUrl: 'ascension/views/caseAssociates.html',
        restrict: 'A',
        controller: 'CaseAssociates'
    };
});
