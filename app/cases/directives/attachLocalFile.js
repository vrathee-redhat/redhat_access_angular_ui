'use strict';
angular.module('RedhatAccess.cases').directive('rhaAttachlocalfile', function () {
    return {
        templateUrl: 'cases/views/attachLocalFile.html',
        restrict: 'A',
        controller: 'AttachLocalFile',
        scope: { disabled: '=' }
    };
});