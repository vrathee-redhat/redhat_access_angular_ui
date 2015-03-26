'use strict';
angular.module('RedhatAccess.ascension').directive('rhaOwnerinfo', function () {
    return {
        templateUrl: 'ascension/views/ownerInfo.html',
        restrict: 'A',
        controller: 'OwnerInfo'
    };
});
