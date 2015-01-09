'use strict';
angular.module('RedhatAccess.cases').controller('CompactCaseList', [
    '$scope',
    '$stateParams',
    'strataService',
    'CaseService',
    '$rootScope',
    'AUTH_EVENTS',
    'securityService',
    'SearchCaseService',
    'AlertService',
    'SearchBoxService',
    'RHAUtils',
    '$filter',
    'CASE_EVENTS',
    function ($scope, $stateParams, strataService, CaseService, $rootScope, AUTH_EVENTS, securityService, SearchCaseService, AlertService, SearchBoxService, RHAUtils, $filter, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.selectedCaseIndex = -1;
        $scope.SearchCaseService = SearchCaseService;
        $scope.selectCase = function ($index) {
            if ($scope.selectedCaseIndex !== $index) {
                $scope.selectedCaseIndex = $index;
            }
        };
        $scope.domReady = false;

        //used to notify resizable directive that the page has loaded
        $scope.doSearch = function () {
            SearchCaseService.doFilter().then(function () {
                if (RHAUtils.isNotEmpty($stateParams.id) && $scope.selectedCaseIndex === -1) {
                    var selectedCase = $filter('filter')(SearchCaseService.cases, { 'case_number': $stateParams.id });
                    $scope.selectedCaseIndex = SearchCaseService.cases.indexOf(selectedCase[0]);
                }
                $scope.domReady = true;
            });
        };
        $scope.doSearchDeregister = $rootScope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.doSearch();
        });
        if (securityService.loginStatus.isLoggedIn) {
            CaseService.populateGroups();
            $scope.doSearch();
        }
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            CaseService.populateGroups();
            $scope.doSearch();
            AlertService.clearAlerts();
        });
        $scope.$on('$destroy', function () {
            $scope.doSearchDeregister();
        });
    }
]);