'use strict';
angular.module('RedhatAccess.cases').directive('rhaOwnerinfo', function () {
    return {
        templateUrl: 'ascension/views/ownerInfo.html',
        restrict: 'A',
        controller: 'OwnerInfo'
    };
});
