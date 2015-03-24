'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('List', [
    '$scope',
    '$filter',
	'$location',
	'$state',
    '$modal',
    'securityService',
    'AlertService',
    'SearchCaseService',
    'CaseService',
    'strataService',
    'AUTH_EVENTS',
    'SearchBoxService',
    'NEW_CASE_CONFIG',
    'CASE_EVENTS',
    'CASE_GROUPS',
    'STATUS',
    function ($scope, $filter, $location, $state, $modal, securityService, AlertService, SearchCaseService, CaseService, strataService, AUTH_EVENTS, SearchBoxService, NEW_CASE_CONFIG, CASE_EVENTS, CASE_GROUPS, STATUS) {
        $scope.SearchCaseService = SearchCaseService;
        $scope.securityService = securityService;
        $scope.AlertService = AlertService;
        $scope.CaseService = CaseService;
        $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
	    $scope.ie8 = window.ie8;
	    $scope.ie9 = window.ie9;
	    $scope.exporting = false;
        $scope.fetching = false;
        $scope.displayedCaseText = 'Open Support Cases';
	    $scope.exports = function () {
		    $scope.exporting = true;
		    strataService.cases.csv().then(function (response) {
			    $scope.exporting = false;
		    }, function (error) {
			    AlertService.addStrataErrorMessage(error);
		    });
	    };

        $scope.$on(CASE_EVENTS.searchSubmit, function () {
            $scope.doSearch();
        });

        $scope.doSearch = function () {
            SearchCaseService.clearPagination();
            if (CaseService.group === CASE_GROUPS.manage) {
                $state.go('group');
            } else {
	            if(CaseService.groups.length === 0){
	                CaseService.populateGroups().then(function (){
	                    SearchCaseService.doFilter().then(function () {

	                    });
	                });
	            } else {
	                SearchCaseService.doFilter();
	            }
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

        $scope.setBreadcrumbs = function(){
            if (window.chrometwo_require !== undefined) {
                breadcrumbs = [
                  ['Support', '/support/'],
                  ['Support Cases',  '/support/cases/'],
                  ['List']];
                updateBreadCrumb();
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
            $scope.setBreadcrumbs();
        }
        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            if(securityService.loginStatus.userAllowedToManageCases){
                $scope.firePageLoadEvent();
                CaseService.status = 'open';
                $scope.doSearch();
                $scope.setBreadcrumbs();
            }
        });

        $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
            CaseService.clearCase();
            SearchCaseService.clear();
        });

	    $scope.caseLink = function (caseNumber) {
		    $location.path('/case/' + caseNumber);
	    };

	    $scope.caseChosen = function() {
	        var trues = $filter("filter")( SearchCaseService.cases, {selected:true} );
	        return trues.length;
	    };

	    $scope.closeCases = function() {
            $modal.open({
                templateUrl: 'cases/views/confirmCaseCloseModal.html',
                controller: 'ConfirmCaseCloseModal'
            });
	    };

        $scope.getCasesText = function(){
            if(CaseService.status === STATUS.open){
                $scope.displayedCaseText = 'Open Support Cases';
            } else if(CaseService.status === STATUS.closed){
                $scope.displayedCaseText = 'Closed Support Cases';
            } else if(CaseService.status === STATUS.both){
                $scope.displayedCaseText = 'Open and Closed Support Cases';
            }
        };

        $scope.loadingRecWatcher = $scope.$watch('CaseService.status', function(newVal) {
            $scope.getCasesText();
        });
    }
]);
