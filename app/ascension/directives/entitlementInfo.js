'use strict';
angular.module('RedhatAccess.cases').directive('rhaEntitlementinfo', function () {
    return {
        templateUrl: 'ascension/views/entitlementInfo.html',
        restrict: 'A',
        controller: 'EntitlementInfo'
    };
});
