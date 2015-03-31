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
        this.start = 0;
        this.count = 50;
        this.total = 0;
        this.allCasesDownloaded = false;
        this.caseListPage = 1;
        this.caseListPageSize = 10;
        this.caseParameters = {
            searchTerm: '',
            status: STATUS.open,
            group: ''

        };
        var getIncludeClosed = function () {
            if (CaseService.status === STATUS.open) {
                return false;
            } else if (CaseService.status === STATUS.closed) {
                return true;
            } else if (CaseService.status === STATUS.both) {
                return true;
            }
            return true;
        };
        this.clear = function () {
            this.cases = [];
            this.oldQueryString = '';
            SearchBoxService.searchTerm = '';
            this.start = 0;
            this.total = 0;
            this.totalCases = 0;
            this.allCasesDownloaded = false;
            this.searching = true;
        };
        this.clearPagination = function () {
            this.start = 0;
            this.total = 0;
            this.allCasesDownloaded = false;
            this.cases = [];
        };
        this.oldQueryString = '';
        var queryString = '';

        this.doFilter = function (checkIsInternal) {
            if(this.caseParameters.group === ''){
                this.caseParameters.group = CaseService.group;
            }
            queryString = '';

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
                //TODO add internal pallet
                // if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                //     params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                //     //params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                //     //params.view = 'internal';
                // }

            if(this.caseParameters.searchTerm === undefined || this.caseParameters.searchTerm === ''){
                var params = {
                    count: this.count,
                    include_closed: getIncludeClosed()
                };
                if(COMMON_CONFIG.isGS4 === true){
                    params.account_number = "639769";
                }
                params.start = this.start;
                var isObjectNothing = function (object) {
                    if (object === '' || object === undefined || object === null) {
                        return true;
                    } else {
                        return false;
                    }
                };
                if (!isObjectNothing(this.caseParameters.searchTerm)) {
                    params.keyword = this.caseParameters.searchTerm;
                }
                if (this.caseParameters.group === CASE_GROUPS.manage) {
                    $state.go('group');
                } else if (this.caseParameters.group === CASE_GROUPS.ungrouped) {
                    params.only_ungrouped = true;
                } else if (!isObjectNothing(CaseService.group)) {
                    params.group_numbers = { group_number: [this.caseParameters.group] };
                }
                if (this.caseParameters.status === STATUS.closed) {
                    params.status = STATUS.closed;
                }
                // if (!isObjectNothing(CaseService.product)) {
                //     params.product = CaseService.product;
                // }
                if (!isObjectNothing(CaseService.sortBy)) {
                    params.sort_field = CaseService.sortBy;
                }
                if (!isObjectNothing(CaseService.sortOrder)) {
                    params.sort_order = CaseService.sortOrder;
                }
                if (!isObjectNothing(CaseService.owner)) {
                    params.owner_ssoname = CaseService.owner;
                }
                if (!isObjectNothing(CaseService.type)) {
                    params.type = CaseService.type;
                }
                if (!isObjectNothing(CaseService.severity)) {
                    params.severity = CaseService.severity;
                }
                if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                    params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                    params.view = 'internal';
                }
                cases = strataService.cases.filter(params).then(angular.bind(that, function (response) {
                    if(response['case'] === undefined ){
                        that.totalCases = 0;
                        that.total = 0;
                        that.allCasesDownloaded = true;
                    } else {
                        that.totalCases = response.total_count;
                        if (response['case'] !== undefined && response['case'].length + that.total >= that.totalCases) {
                            that.allCasesDownloaded = true;
                        }
                        if (response['case'] !== undefined){
                            that.cases = that.cases.concat(response['case']);
                            //that.count = response['case'].length + that.total
                            that.start = that.start + that.count;
                            that.total = that.total + response['case'].length;
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
            } else{
                cases = strataService.cases.search(this.caseParameters.status, caseOwner, this.caseParameters.group, this.caseParameters.searchTerm, CaseService.filterSelect.sortField, CaseService.filterSelect.sortOrder, this.start, this.count, null, null).then(angular.bind(that, function (response) {
                    if(response['case'] === undefined){
                        that.totalCases = 0;
                        that.total = 0;
                        that.allCasesDownloaded = true;
                    } else {
                        that.totalCases = response.total_count;
                        that.cases = that.cases.concat(response['case']);
                        that.start = that.start + that.count;
                        that.total = that.total + response['case'].length;
                        if (response['case'] !== undefined && response['case'].length + that.total >= that.totalCases) {
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
