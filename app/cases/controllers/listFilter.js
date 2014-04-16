'use strict';

angular.module('RedhatAccess.cases')
.controller('ListFilter', [
  '$scope',
  'strataService',
  'STATUS',
  'CaseListService',
  function ($scope, strataService, STATUS, CaseListService) {

    $scope.groups = [];
    strataService.groups.list().then(
        function(groups) {
          $scope.groups = groups;
        }
    );

    $scope.statusFilter = STATUS.both;

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

    $scope.onFilterKeyPress = function($event) {
      if ($event.keyCode === 13) {
        $scope.doFilter();
      }
    };

    $scope.doFilter = function() {

      if (angular.isFunction($scope.prefilter)) {
        $scope.prefilter();
      }

      var params = {
        include_closed: getIncludeClosed(),
        count: 50
      };

      if ($scope.keyword != null) {
        params.keyword = $scope.keyword;
      }

      if ($scope.group != null) {
        params.group_numbers = {
          group_number: [$scope.group.number]
        };
      }

      if ($scope.statusFilter === STATUS.closed) {
        params.status = STATUS.closed;
      }

      strataService.cases.filter(params).then(
          function(filteredCases) {
            if (filteredCases === undefined) {
              CaseListService.defineCases([]);
            } else {
              CaseListService.defineCases(filteredCases);
            }

            if (angular.isFunction($scope.postfilter)) {
              $scope.postfilter();
            }
          }
      );
    };
  }
]);
