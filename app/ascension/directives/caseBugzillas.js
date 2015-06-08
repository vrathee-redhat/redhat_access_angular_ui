'use strict';
angular.module('RedhatAccess.ascension').directive('rhaCasebugzillas', function () {
    return {
        templateUrl: 'ascension/views/caseBugzillas.html',
        restrict: 'A',
        controller: 'CaseBugzillas'
    };
});
