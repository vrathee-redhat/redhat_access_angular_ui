'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCaseview', function () {
    return {
        templateUrl: 'ascension/views/caseView.html',
        restrict: 'A',
        controller: 'CaseView'
    };
});