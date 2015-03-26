'use strict';
angular.module('RedhatAccess.ascension').directive('rhaAccountinfo', function () {
    return {
        templateUrl: 'ascension/views/accountInfo.html',
        restrict: 'A',
        controller: 'AccountInfo'
    };
});
