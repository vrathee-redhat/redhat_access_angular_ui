'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases')
.controller('List', [
  '$scope',
  '$filter',
  'ngTableParams',
  'securityService',
  'AlertService',
  '$rootScope',
  'SearchCaseService',
  'CaseService',
  'AUTH_EVENTS',
  'SearchBoxService',
  function ($scope,
            $filter,
            ngTableParams,
            securityService,
            AlertService,
            $rootScope,
            SearchCaseService,
            CaseService,
            AUTH_EVENTS,
            SearchBoxService) {
    $scope.SearchCaseService = SearchCaseService;
    $scope.securityService = securityService;
    $scope.AlertService = AlertService;
    AlertService.clearAlerts();

    var tableBuilt = false;

    var buildTable = function() {
      /*jshint newcap: false*/
      $scope.tableParams = new ngTableParams({
        page: 1,
        count: 10,
        sorting: {
          last_modified_date: 'desc'
        }
      }, {
        total: SearchCaseService.cases.length,
        getData: function($defer, params) {
          var orderedData = params.sorting() ?
              $filter('orderBy')(SearchCaseService.cases, params.orderBy()) : SearchCaseService.cases;

          var pageData = orderedData.slice(
              (params.page() - 1) * params.count(), params.page() * params.count());

          $scope.tableParams.total(orderedData.length);
          $defer.resolve(pageData);
        }
      });

      tableBuilt = true;
    };

    SearchBoxService.doSearch = 
    CaseService.onSelectChanged = 
    CaseService.onOwnerSelectChanged = 
    CaseService.onGroupSelectChanged = function() {
      SearchCaseService.doFilter($scope.securityService.getLoggedInUserName).then(
          function() {
            if (!tableBuilt) {
              buildTable();
            } else {
              $scope.tableParams.reload();
            }
          }
      );
    };

    /**
     * Callback after user login. Load the cases and clear alerts
     */
    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      SearchBoxService.doSearch();
      AlertService.clearAlerts();
    });

    SearchCaseService.clear();
    SearchBoxService.doSearch();
  }
]);
