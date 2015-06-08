'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCaseflags', function () {
    return {
        templateUrl: 'ascension/views/caseFlags.html',
        restrict: 'A',
        controller: 'CaseFlags'
    };
});