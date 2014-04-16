'use strict';

angular.module('RedhatAccess.cases')
.controller('List', [
  '$scope',
  '$filter',
  'ngTableParams',
  'STATUS',
  'strataService',
  'CaseListService',
  function ($scope, $filter, ngTableParams, STATUS, strataService, CaseListService) {
    $scope.CaseListService = CaseListService;

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

    $scope.loadingCases = true;
    strataService.cases.filter().then(
        function(cases) {
          CaseListService.defineCases(cases);
          buildTable();
          $scope.loadingCases = false;
        }
    );

    $scope.preFilter = function() {
      $scope.loadingCases = true;
    };

    $scope.postFilter = function() {
      $scope.tableParams.reload();
      $scope.loadingCases = false;
    };
  }
]);
