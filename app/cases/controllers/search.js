'use strict';

angular.module('RedhatAccess.cases')
.controller('Search', [
  '$scope',
  '$rootScope',
  'AUTH_EVENTS',
  'securityService',
  'SearchCaseService',
  'CaseService',
  'STATUS',
  'SearchBoxService',
  'AlertService',
  function (
    $scope,
    $rootScope,
    AUTH_EVENTS,
    securityService,
    SearchCaseService,
    CaseService,
    STATUS,
    SearchBoxService,
    AlertService) {

    $scope.securityService = securityService;
    $scope.SearchCaseService = SearchCaseService;
    $scope.CaseService = CaseService;

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

    SearchBoxService.doSearch = 
    CaseService.onSelectChanged = 
    CaseService.onOwnerSelectChanged = 
    CaseService.onGroupSelectChanged = function() {
      SearchCaseService.doFilter($scope.securityService.getLoggedInUserName).then(
          function() {
            $scope.selectPage(1);      
          }
      );
    };

    $rootScope.$on(AUTH_EVENTS.loginSuccess, function() {
      SearchBoxService.doSearch();
      AlertService.clearAlerts();
    });

    $rootScope.$on(AUTH_EVENTS.logoutSuccess, function() {
      CaseService.clearCase();
      SearchCaseService.clear();
    });

    CaseService.clearCase();
    SearchCaseService.clear();
    SearchBoxService.doSearch();
  }
]);
