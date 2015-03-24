'use strict';
angular.module('RedhatAccess.cases').directive('rhaAccountinfo', function () {
    return {
        templateUrl: 'ascension/views/accountInfo.html',
        restrict: 'A',
        controller: 'AccountInfo'
    };
});
