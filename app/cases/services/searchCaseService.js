/*jshint camelcase: false*/
'use strict';
angular.module('RedhatAccess.cases').service('SearchCaseService', [
    'CaseService',
    'strataService',
    'AlertService',
    'STATUS',
    'CASE_GROUPS',
    'AUTH_EVENTS',
    '$q',
    '$rootScope',
    'SearchBoxService',
    'securityService',
    'COMMON_CONFIG',
    function (CaseService, strataService, AlertService, STATUS, CASE_GROUPS, AUTH_EVENTS, $q, $rootScope, SearchBoxService, securityService, COMMON_CONFIG) {
        this.cases = [];
        this.totalCases = 0;
        this.searching = true;
        this.postfilter = {};
        this.start = 0;
        this.count = 50;
        this.total = 0;
        this.allCasesDownloaded = false;
        this.caseListPage = 1;
        this.caseListPageSize = 10;
        this.clear = function () {
            this.cases = [];
            this.oldQueryString = "";
            SearchBoxService.searchTerm = '';
            this.start = 0;
            this.total = 0;
            this.totalCases = 0;
            this.allCasesDownloaded = false;
            this.postfilter = {};
            this.searching = true;
        };
        this.clearPagination = function () {
            this.start = 0;
            this.total = 0;
            this.allCasesDownloaded = false;
            this.cases = [];
        };
        this.oldQueryString = "";
        var queryString = "";

        this.doFilter = function (checkIsInternal) {
            queryString = "";

            //TODO add internal and GS4
            // if(COMMON_CONFIG.isGS4 === true){
            //     params.account_number = "639769";
            // }
            var caseOwner = '';
            if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                caseOwner = "\"" + securityService.loginStatus.authedUser.first_name + " " + securityService.loginStatus.authedUser.last_name + "\"";
            }

            var promises = [];
            var deferred = $q.defer();
            //if (!angular.equals(queryString, this.oldQueryString)) {
                this.searching = true;
                this.oldQueryString = queryString;
                var that = this;
                var cases = null;
                if (securityService.loginStatus.isLoggedIn) {
                    //TODO add internal pallet
                    // if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                    //     params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                    //     //params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                    //     //params.view = 'internal';
                    // }
                    cases = strataService.cases.search(CaseService.status, caseOwner, CaseService.group, SearchBoxService.searchTerm, CaseService.filterSelect.sortField, CaseService.filterSelect.sortOrder, this.start, this.count, null, null).then(angular.bind(that, function (response) {
                        if(response.case === undefined){
                            that.totalCases = 0;
                            that.total = 0;
                            that.allCasesDownloaded = true;
                        } else {
	                        that.totalCases = response.total_count;
	                        that.cases = that.cases.concat(response.case);
	                        that.start = that.start + that.count;
	                        that.total = that.total + response.case.length;
	                        if(response.case.length !== 50){
                        		that.allCasesDownloaded = true;
                        	}
                    	}
                        that.searching = false;
                        deferred.resolve(cases);
                    }), angular.bind(that, function (error) {
                        if(error.xhr.status === 404){
                            this.doFilter(false).then(function () {
                                deferred.resolve(cases);
                            });
                        } else{
                            AlertService.addStrataErrorMessage(error);
                            that.searching = false;
                            deferred.resolve(cases);
                        }
                    }));
                } else {
                    $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
                        if (securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal) {
                            params.owner_ssoname = securityService.loginStatus.authedUser.sso_username;
                        }
                        cases = strataService.cases.filter(params).then(angular.bind(that, function (response) {
                            that.totalCases = response.total_count;

                            that.cases = that.cases.concat(response['case']);
                            that.searching = false;
                            that.start = that.start + that.count;
                            that.total = that.total + response['case'].length;
                            if (that.total >= that.totalCases) {
                                that.allCasesDownloaded = true;
                            }
                            if (angular.isFunction(that.postFilter)) {
                                that.postFilter();
                            }
                        }), angular.bind(that, function (error) {
                            AlertService.addStrataErrorMessage(error);
                            that.searching = false;
                        }));
                        deferred.resolve(cases);
                    });
                }
                promises.push(deferred.promise);
            // } else {
            //     deferred.resolve();
            //     promises.push(deferred.promise);
            // }
            return $q.all(promises);
        };
    }
]);
