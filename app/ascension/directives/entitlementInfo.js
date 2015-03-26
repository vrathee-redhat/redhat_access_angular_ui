'use strict';
angular.module('RedhatAccess.ascension').directive('rhaEntitlementinfo', function () {
    return {
        templateUrl: 'ascension/views/entitlementInfo.html',
        restrict: 'A',
        controller: 'EntitlementInfo'
    };
});
