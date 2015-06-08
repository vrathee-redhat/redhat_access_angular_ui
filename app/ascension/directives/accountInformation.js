'use strict';
angular.module('RedhatAccess.ascension').directive('rhaAccountinformation', function () {
    return {
        templateUrl: 'ascension/views/accountInformation.html',
        restrict: 'A',
        controller: 'AccountInformation'
    };
});
