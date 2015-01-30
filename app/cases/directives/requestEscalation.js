'use strict';
angular.module('RedhatAccess.cases').directive('rhaRequestescalation', function () {
    return {
        templateUrl: 'cases/views/requestEscalation.html',
        restrict: 'A',
        controller: 'RequestEscalation'
    };
});
