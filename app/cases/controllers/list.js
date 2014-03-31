'use strict';

angular.module('RedhatAccessCases')
.controller('List', [
  '$scope',
  '$filter',
  'casesJSON',
  'groupsJSON',
  'ngTableParams',
  function ($scope, $filter, casesJSON, groupsJSON, ngTableParams) {
    $scope.cases = casesJSON;
    $scope.groups = groupsJSON;

    $scope.tableParams = new ngTableParams({
      page: 1,
      count: 10,
      sorting: {
        last_modified_date: 'desc'
      }
    }, {
      total: $scope.cases.length,
      getData: function($defer, params) {
        var orderedData = params.sorting() ?
            $filter('orderBy')($scope.cases, params.orderBy()) : $scope.cases;

        orderedData = $filter('filter')(orderedData, $scope.keyword);
        var pageData = orderedData.slice(
            (params.page() - 1) * params.count(), params.page() * params.count());

        $scope.tableParams.total(orderedData.length);
        $defer.resolve(pageData);
      }
    });

    $scope.filterByGroup = function(groupNumber) {
      strata.cases.filter(
          {
            group_numbers: [{group_number: groupNumber}]
          },
          function(filteredCases) {
            $scope.cases = filteredCases;
            $scope.tableParams.refresh();
            $scope.apply();
          },
          function(error) {
            console.log(error);
          }
      );
    };
  }
]);
