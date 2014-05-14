'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases')
.controller('List', [
  '$scope',
  '$filter',
  'ngTableParams',
  'STATUS',
  'strataService',
  'CaseListService',
  'securityService',
  'AlertService',
  '$rootScope',
  'AUTH_EVENTS',
  function ($scope,
            $filter,
            ngTableParams,
            STATUS,
            strataService,
            CaseListService,
            securityService,
            AlertService,
            $rootScope,
            AUTH_EVENTS) {
    $scope.CaseListService = CaseListService;
    $scope.securityService = securityService;
    $scope.AlertService = AlertService;
    AlertService.clearAlerts();

    var buildTable = function() {
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          last_modified_date: 'desc'
        }
      }, {
        total: CaseListService.cases.length,
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
              $filter('orderBy')(CaseListService.cases, params.orderBy()) : CaseListService.cases;

          var pageData = orderedData.slice(
              (params.page() - 1) * params.count(), params.page() * params.count());

          $scope.tableParams.total(orderedData.length);
          $defer.resolve(pageData);
        }
      });
    };

    $scope.loadCases = function() {
      $scope.loadingCases = true;
      strataService.cases.filter().then(
          function(cases) {
            CaseListService.defineCases(cases);
            buildTable();
            $scope.loadingCases = false;
          },
          function(error) {
            AlertService.addStrataErrorMessage(error);
          }
      );
    };
    $scope.loadCases();

    /**
     * Callback after user login. Load the cases and clear alerts
     */
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      $scope.loadCases();
      AlertService.clearAlerts();
    });

    /**
     * Callback from listFilter directive
     */
    $scope.preFilter = function() {
      $scope.loadingCases = true;
    };


    /**
     * Callback from listFilter directive.
     * Fired after filtering the case list via strata api call.
     * Reload the table.
     */
    $scope.postFilter = function() {
      $scope.tableParams.reload();
      $scope.loadingCases = false;
    };
  }
]);
