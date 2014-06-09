'use strict';

angular.module('RedhatAccess.cases')
.controller('Search', [
  '$scope',
  'securityService',
  'SearchCaseService',
  'CaseService',
  'STATUS',
  function (
    $scope,
    securityService,
    SearchCaseService,
    CaseService,
    STATUS) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;

    $scope.onSearchKeyPress = function($event) {
      if ($event.keyCode === 13) {
        CaseService.onSelectChanged();
      }
    };

    $scope.itemsPerPage = 10;
    $scope.maxPagerSize = 5;

    $scope.selectPage = function(pageNum) {
      var start = $scope.itemsPerPage * (pageNum - 1);
      var end = start + $scope.itemsPerPage;
      end = end > SearchCaseService.cases.length ?
          SearchCaseService.cases.length : end;

      $scope.casesOnScreen =
          SearchCaseService.cases.slice(start, end);
    };

    CaseService.onSelectChanged = function() {
      SearchCaseService.doFilter().then(
          function() {
            $scope.selectPage(1);      
          }
      );
    };

    CaseService.clearCase();
    SearchCaseService.clear();
    CaseService.onSelectChanged();
  }
]);
