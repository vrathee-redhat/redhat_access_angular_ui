'use strict';
angular.module('RedhatAccess.cases').controller('Search', [
    '$scope',
    '$rootScope',
    'AUTH_EVENTS',
    'securityService',
    'SearchCaseService',
    'CaseService',
    'STATUS',
    'SearchBoxService',
    'AlertService',
    'CASE_EVENTS',
    function ($scope, $rootScope, AUTH_EVENTS, securityService, SearchCaseService, CaseService, STATUS, SearchBoxService, AlertService, CASE_EVENTS) {
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
        $scope.itemsPerPage = 10;
        $scope.maxPagerSize = 5;
        $scope.selectPage = function (pageNum) {
            if (!SearchCaseService.allCasesDownloaded && $scope.itemsPerPage * pageNum / SearchCaseService.total >= 0.8) {
                SearchCaseService.doFilter().then(function () {
                    var start = $scope.itemsPerPage * (pageNum - 1);
                    var end = start + $scope.itemsPerPage;
                    end = end > SearchCaseService.cases.length ? SearchCaseService.cases.length : end;
                    $scope.casesOnScreen = SearchCaseService.cases.slice(start, end);
                });
            } else {
                var start = $scope.itemsPerPage * (pageNum - 1);
                var end = start + $scope.itemsPerPage;
                end = end > SearchCaseService.cases.length ? SearchCaseService.cases.length : end;
                $scope.casesOnScreen = SearchCaseService.cases.slice(start, end);
            }
        };

        $scope.doSearchDeregister = $rootScope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.doSearch();
        });

        $scope.doSearch = function () {
            SearchCaseService.clearPagination();
            SearchCaseService.doFilter().then(function () {
                $scope.selectPage(1);
            });
        };
        if (securityService.loginStatus.isLoggedIn) {
            CaseService.clearCase();
            SearchCaseService.clear();
            $scope.doSearch();
        }
        $scope.authEventLoginSuccess = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.doSearch();
            AlertService.clearAlerts();
        });
        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            SearchCaseService.clear();
        });

        $scope.$on('$destroy', function () {
            $scope.doSearchDeregister();
            $scope.authEventLoginSuccess();
            $scope.authEventLogoutSuccess();
        });
    }
]);
