'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaVersionselect', function () {
    return {
        templateUrl: 'cases/views/versionSelect.html',
        restrict: 'A',
        controller: 'VersionSelect'
    };
});