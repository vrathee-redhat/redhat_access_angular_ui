'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaSelectloadingindicator', function () {
    return {
        templateUrl: 'cases/views/selectLoadingIndicator.html',
        restrict: 'A',
        transclude: true,
        scope: {
            loading: '=',
            type: '@'
        }
    };
});