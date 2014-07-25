'use strict';

angular.module('RedhatAccess.cases')
.directive('rhaEntitlementselect', function () {
  return {
    templateUrl: 'cases/views/entitlementSelect.html',
    restrict: 'A',
    controller: 'EntitlementSelect'
  };
});
