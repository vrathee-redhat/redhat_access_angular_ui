'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('List', [
    '$scope',
    '$filter',
	'$location',
    'securityService',
    'AlertService',
    '$rootScope',
    'SearchCaseService',
    'CaseService',
    'strataService',
    'AUTH_EVENTS',
    'SearchBoxService',
    'NEW_CASE_CONFIG',
    'CASE_EVENTS',
    function ($scope, $filter, $location, securityService, AlertService, $rootScope, SearchCaseService, CaseService, strataService, AUTH_EVENTS, SearchBoxService, NEW_CASE_CONFIG, CASE_EVENTS) {
        $scope.SearchCaseService = SearchCaseService;
        $scope.securityService = securityService;
        $scope.AlertService = AlertService;
        $scope.CaseService = CaseService;
        $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
	    $scope.ie8 = window.ie8;
	    $scope.ie9 = window.ie9;
	    $scope.exporting = false;
        $scope.fetching = false;
	    $scope.exports = function () {
		    $scope.exporting = true;
		    strataService.cases.csv().then(function (response) {
			    $scope.exporting = false;
		    }, function (error) {
			    AlertService.addStrataErrorMessage(error);
		    });
	    };

        $scope.doSearchDeregister = $rootScope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.doSearch();
        });

        $scope.doSearch = function () {
            SearchCaseService.clearPagination();
            // if($scope.tableParams !== undefined){
            //     SearchCaseService.caseListPage = 1;
            //     SearchCaseService.caseListPageSize = 10;
            //     $scope.tableParams.$params.page = SearchCaseService.caseListPage;
            //     $scope.tableParams.$params.count = SearchCaseService.caseListPageSize;
            // }
            if(CaseService.groups.length === 0){
                CaseService.populateGroups().then(function (){
                    SearchCaseService.doFilter().then(function () {

                    });
                });
            } else {
                //CaseService.buildGroupOptions();
                SearchCaseService.doFilter();
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
            $scope.doSearch();
        }
        $scope.listAuthEventDeregister = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            if(securityService.loginStatus.userAllowedToManageCases){
                $scope.firePageLoadEvent();
                CaseService.status = 'open';
                $scope.doSearch();
                //AlertService.clearAlerts();
            }
        });

        $scope.authEventLogoutSuccess = $rootScope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            SearchCaseService.clear();
        });
        
        $scope.$on('$destroy', function () {
            $scope.doSearchDeregister();
            $scope.listAuthEventDeregister();
            $scope.authEventLogoutSuccess();
            CaseService.clearCase();
        });

	    $scope.caseLink = function (caseNumber) {
		    $location.path('/case/' + caseNumber);
	    }

	    $scope.caseChosen = function() {
	        var trues = $filter("filter")( SearchCaseService.cases, {selected:true} );
	        return trues.length;
	    }

	    $scope.closeCases = function() {
	        angular.forEach(SearchCaseService.cases, angular.bind(this, function (kase) {
	        	if(kase.selected){
	        		strataService.cases.put(kase.case_number, {status: 'Closed'}).then( angular.bind(kase, function (response) {
					    AlertService.clearAlerts();
					    AlertService.addSuccessMessage("Case " + kase.case_number + " successfully closed.");
				    }), function (error) {
					    AlertService.addStrataErrorMessage(error);
				    });
	        	}
	        }));
	    }
    }
]);