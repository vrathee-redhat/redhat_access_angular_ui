'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('List', [
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
    'NEW_CASE_CONFIG',
    function ($scope, $filter, ngTableParams, securityService, AlertService, $rootScope, SearchCaseService, CaseService, AUTH_EVENTS, SearchBoxService, NEW_CASE_CONFIG) {
        $scope.SearchCaseService = SearchCaseService;
        $scope.securityService = securityService;
        $scope.AlertService = AlertService;
        $scope.CaseService = CaseService;
        $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
        AlertService.clearAlerts();
        var tableBuilt = false;
        var buildTable = function () {
            /*jshint newcap: false*/
            $scope.tableParams = new ngTableParams({
                page: SearchCaseService.caseListPage,
                count: SearchCaseService.caseListPageSize,
                sorting: { last_modified_date: 'desc' }
            }, {
                total: SearchCaseService.totalCases,
                getData: function ($defer, params) {
                    SearchCaseService.caseListPage = params.page();
                    SearchCaseService.caseListPageSize = params.count();
                    if (!SearchCaseService.allCasesDownloaded && params.count() * params.page() >= SearchCaseService.total) {
                        SearchCaseService.doFilter().then(function () {
                            if($scope.tableParams.$params.page * params.count() >= SearchCaseService.total){
                                $scope.tableParams.$params.page = (params.count() + SearchCaseService.count) / params.count();
                            }
                            var orderedData = params.sorting() ? $filter('orderBy')(SearchCaseService.cases, params.orderBy()) : SearchCaseService.cases;
                            var pageData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                            $scope.tableParams.total(SearchCaseService.totalCases);
                            $defer.resolve(pageData);
                        });
                    } else {
                        var orderedData = params.sorting() ? $filter('orderBy')(SearchCaseService.cases, params.orderBy()) : SearchCaseService.cases;
                        var pageData = orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count());
                        $scope.tableParams.total(SearchCaseService.totalCases);
                        $defer.resolve(pageData);
                    }
                }
            });
            tableBuilt = true;
        };
        SearchBoxService.doSearch = CaseService.onSelectChanged = CaseService.onOwnerSelectChanged = CaseService.onGroupSelectChanged = function () {
            SearchCaseService.clearPagination();
            if($scope.tableParams !== undefined){
                SearchCaseService.caseListPage = 1;
                SearchCaseService.caseListPageSize = 10;
                $scope.tableParams.$params.page = SearchCaseService.caseListPage;
                $scope.tableParams.$params.count = SearchCaseService.caseListPageSize;
            }
            if(CaseService.groups.length === 0){
                CaseService.populateGroups().then(function (){
                    SearchCaseService.doFilter().then(function () {
                        if (!tableBuilt) {
                            buildTable();
                        } else {
                            $scope.tableParams.reload();
                        }
                    });
                });
            } else {
                //CaseService.buildGroupOptions();
                SearchCaseService.doFilter().then(function () {
                    if (!tableBuilt) {
                        buildTable();
                    } else {
                        $scope.tableParams.reload();
                    }
                });
            }
        };

        $scope.firePageLoadEvent = function () {
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/attributes', 'analytics/main'], function(attrs, paf) {
                    attrs.harvest();
                    paf.report();
                });
            }
        };

        /**
       * Callback after user login. Load the cases and clear alerts
       */
        if (securityService.loginStatus.isLoggedIn && securityService.loginStatus.userAllowedToManageCases) {
            $scope.firePageLoadEvent();
            SearchCaseService.clear();
            CaseService.status = 'open';
            SearchBoxService.doSearch();
        }
        $scope.listAuthEventDeregister = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            if(securityService.loginStatus.userAllowedToManageCases){
                $scope.firePageLoadEvent();
                CaseService.status = 'open';
                SearchBoxService.doSearch();
                AlertService.clearAlerts();
            }
        });

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            SearchCaseService.clear();
        });
        
        $scope.$on('$destroy', function () {
            $scope.listAuthEventDeregister();
            CaseService.clearCase();
        });
    }
]);