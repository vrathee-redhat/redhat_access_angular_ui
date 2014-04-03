'use strict';

angular.module('RedhatAccessCases')
.controller('List', [
  '$scope',
  '$filter',
  'casesJSON',
  'groupsJSON',
  'ngTableParams',
  'STATUS',
  function ($scope, $filter, casesJSON, groupsJSON, ngTableParams, STATUS) {
    $scope.statusFilter = STATUS.open;

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

    var doCaseFilter = function(params) {
      strata.cases.filter(
          params,
          function(filteredCases) {
            if (filteredCases === undefined) {
              $scope.cases = [];
            } else {
              $scope.cases = filteredCases;
            }
            $scope.tableParams.reload();
          },
          function(error) {
            console.log(error);
          }
      );
    };

    var getIncludeClosed = function() {
      if ($scope.statusFilter === STATUS.open) {
        return false;
      } else if ($scope.statusFilter === STATUS.closed) {
        return true;
      } else if ($scope.statusFilter === STATUS.both) {
        return true;
      }

      return false;
    };

    $scope.doFilter = function() {
      var params = {
        include_closed: getIncludeClosed()
      };

      if ($scope.group !== undefined) {
        params.group_numbers = {
          group_number: [$scope.group.number]
        };
      }

      if ($scope.statusFilter === STATUS.closed) {
        params.status = STATUS.closed;
      }

      doCaseFilter(params);
    };

  }
]);
