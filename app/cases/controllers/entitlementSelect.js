'use strict';
/*global $ */

angular.module('RedhatAccess.cases')
.controller('EntitlementSelect', [
  '$scope',
  'strataService',
  'AlertService',
  '$filter',
  'RHAUtils',
  'CaseService',
  'ENTITLEMENTS',
  function ($scope, strataService, AlertService, $filter, RHAUtils, CaseService, ENTITLEMENTS) {

    $scope.CaseService = CaseService;

    $scope.entitlementsLoading = true;
    strataService.entitlements.get(false).then(
      function(entitlementsResponse) {
        // if the user has any premium or standard level entitlement, then allow them
        // to select it, regardless of the product.
        // TODO: strata should respond with a filtered list given a product.
        //       Adding the query param ?product=$PRODUCT does not work.
        var premiumSupport = $filter('filter')(entitlementsResponse.entitlement, {'sla': ENTITLEMENTS.premium});
        var standardSupport = $filter('filter')(entitlementsResponse.entitlement, {'sla': ENTITLEMENTS.standard});

        var entitlements = [];
        if (RHAUtils.isNotEmpty(premiumSupport)) {
          entitlements.push(ENTITLEMENTS.premium);
        }
        if (RHAUtils.isNotEmpty(standardSupport)) {
          entitlements.push(ENTITLEMENTS.standard);
        }

        if (entitlements.length === 0) {
          entitlements.push(ENTITLEMENTS.default);
        }

        CaseService.entitlements = entitlements;
        $scope.entitlementsLoading = false;
      },
      function(error) {
        AlertService.addStrataErrorMessage(error);
      });
  }
]);
