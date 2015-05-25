'use strict';
angular.module('RedhatAccess.ascension').directive('rhaEntitlementinformation', function () {
    return {
        templateUrl: 'ascension/views/entitlementInformation.html',
        restrict: 'A',
        controller: 'EntitlementInformation'
    };
});
