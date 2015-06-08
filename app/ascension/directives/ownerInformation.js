'use strict';
angular.module('RedhatAccess.ascension').directive('rhaOwnerinformation', function () {
    return {
        templateUrl: 'ascension/views/ownerInformation.html',
        restrict: 'A',
        controller: 'OwnerInformation'
    };
});
