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
    '$state',
    '$rootScope',
    'SearchBoxService',
    'securityService',
    'COMMON_CONFIG',
    function (CaseService, strataService, AlertService, STATUS, CASE_GROUPS, AUTH_EVENTS, $q, $state, $rootScope, SearchBoxService, securityService, COMMON_CONFIG) {
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
            //this.oldParams = {};
            this.oldQueryString = ""
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
        //this.oldParams = {};
        this.oldQueryString = ""

        var queryString = "";
        var concatQueryString = function(param){
            if(queryString === ""){
                queryString = param;
            }else{
                queryString = queryString.concat(" AND " + param);
            }
        }
        this.doFilter = function (checkIsInternal) {
            queryString = "";// "start=" + this.start "&rows=" + this.count + "&query=";

            if (CaseService.status === STATUS.open) {
                concatQueryString("+case_status:Waiting*")
            } else if (CaseService.status === STATUS.closed) {
                concatQueryString("+case_status:Closed")
            } else{
                concatQueryString("+case_status:*")
            }
            //TODO add internal and GS4
            // if(COMMON_CONFIG.isGS4 === true){
            //     params.account_number = "639769";
            // }
            //params.start = this.start;
            var isObjectNothing = function (object) {
                if (object === '' || object === undefined || object === null) {
                    return true;
                } else {
                    return false;
                }
            };
            if (!isObjectNothing(SearchBoxService.searchTerm)) {
                //params.keyword = SearchBoxService.searchTerm;
                concatQueryString("allText:" + SearchBoxService.searchTerm);
            }
            if(!securityService.loginStatus.authedUser.is_internal){
                if (CaseService.group === CASE_GROUPS.manage) {
                    $state.go('group');
                } else if (CaseService.group === CASE_GROUPS.ungrouped) {
                    concatQueryString("+case_hasGroup:false")
                } else if (!isObjectNothing(CaseService.group)) {
                    //TODO add support for case group
                    concatQueryString("+case_folderNumber:" + CaseService.group)
                    //params.group_numbers = { group_number: [CaseService.group] };
                }
            }
            if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                concatQueryString("+case_owner:\"" + securityService.loginStatus.authedUser.first_name + " " + securityService.loginStatus.authedUser.last_name + "\"");
                //params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                //params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                //params.view = 'internal';
            }
            // if (CaseService.status === STATUS.closed) {
            //     params.status = STATUS.closed;
            // }
            // if (!isObjectNothing(CaseService.product)) {
            //     concatQueryString(queryString, "+case_hasGroup:" + CaseService.product)
            //     //params.product = CaseService.product;
            // }
            //Should get for free
            // if (!isObjectNothing(CaseService.owner)) {
            //     params.owner_ssoname = CaseService.owner;
            // }
            //TODO what is case type
            // if (!isObjectNothing(CaseService.type)) {
            //     params.type = CaseService.type;
            // }
            // if (!isObjectNothing(CaseService.severity)) {
            //     params.severity = CaseService.severity;
            // }
            if(!CaseService.filterSelect !== undefined){
                if (CaseService.filterSelect.sortField !== undefined){
                    if(queryString === ""){
                        queryString = "sort=case_" + CaseService.filterSelect.sortField;
                    } else{
                        queryString = queryString + "&sort=case_" + CaseService.filterSelect.sortField;
                    }
                    //params.sort_field = CaseService.filterSelect.sortField;
                }
                if (CaseService.filterSelect.sortOrder !== undefined){
                    queryString = queryString + " " +CaseService.filterSelect.sortOrder;
                    //params.sort_order = CaseService.filterSelect.sortOrder;
                }
            }
            queryString = queryString + "&offset=" + this.start + "&limit=" + this.count;
            // if (!isObjectNothing(CaseService.sortBy)) {
            //     params.sort_field = CaseService.sortBy;
            // }
            // if (!isObjectNothing(CaseService.sortOrder)) {
            //     params.sort_order = CaseService.sortOrder;
            // }
            var promises = [];
            var deferred = $q.defer();
            //if (!angular.equals(params, this.oldParams)) {
            if (!angular.equals(queryString, this.oldQueryString)) {
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
                    cases = strataService.cases.search(queryString, true).then(angular.bind(that, function (response) {
                        if(response.length !== 50 ){
                            that.totalCases = 0;
                            that.total = 0;
                            that.allCasesDownloaded = true;
                        } //else {
                            //TODO fix broken case scrolling
                            //that.totalCases = response.total_count;
                            // if (response['case'] !== undefined && response['case'].length + that.total >= that.totalCases) {
                            //     that.allCasesDownloaded = true;
                            // }
                            //if (response['case'] !== undefined){
                        that.cases = that.cases.concat(response);
                        //that.count = response['case'].length + that.total
                        that.start = that.start + that.count;
                        that.total = that.total + response.length;
                            //}
                            //if (angular.isFunction(that.postFilter)) {
                            //    that.postFilter();
                            //}
                        //}
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
            } else {
                deferred.resolve();
                promises.push(deferred.promise);
            }
            return $q.all(promises);
        };
    }
]);
