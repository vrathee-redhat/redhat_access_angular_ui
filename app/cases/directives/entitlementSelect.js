'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaEntitlementSelect', function () {
  return {
    templateUrl: 'cases/views/entitlementSelect.html',
    restrict: 'E',
    controller: 'EntitlementSelect'
  };
});
