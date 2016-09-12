'use strict';

export default class SearchCaseService {
    constructor(CaseService, strataService, AlertService, STATUS, CASE_GROUPS, $q, SearchBoxService, securityService, COMMON_CONFIG, RHAUtils) {
        'ngInject';

        this.cases = [];
        this.totalCases = 0;
        this.searching = false;
        this.start = 0;
        this.total = 0;
        this.refreshFilterCache = false;
        this.caseParameters = {
            searchTerm: '',
            status: STATUS.open,
            group: ''
        };
        this.previousGroupFilter = CASE_GROUPS.none;

        this.currentPage = 0;
        this.pageSize = 50;
        this.numberOfPages = function() {
            return Math.ceil(this.totalCases / this.pageSize);
        };

        var getIncludeClosed = function (caseParameters) {
            if (caseParameters.status === STATUS.open) {
                return false;
            } else if (caseParameters.status === STATUS.closed) {
                return true;
            } else if (caseParameters.status === STATUS.both) {
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
            this.searching = false;
        };

        // For displaying where we are at in the pagination
        this.getCasesStart = () => {
            return this.currentPage * this.pageSize;
        };

        this.getCasesEnd = () => {
            const end = (this.currentPage * this.pageSize) + this.pageSize;
            if (end > this.totalCases) {
                return this.totalCases;
            }
            return end;
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
            if (this.searching) return;
            this.previousGroupFilter = this.caseParameters.group;
            queryString = '';

            //TODO add internal and GS4
            // if(COMMON_CONFIG.isGS4 === true){
            //     params.account_number = "639769";
            // }
            var caseOwner = '';
            if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
                caseOwner = "\"" + securityService.loginStatus.authedUser.first_name + " " + securityService.loginStatus.authedUser.last_name + "\"";
            }

            var deferred = $q.defer();
            //if (!angular.equals(queryString, this.oldQueryString)) {
            this.oldQueryString = queryString;
            var cases = null;
            //TODO add internal pallet
            // if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined || checkIsInternal === true) {
            //     params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
            //     //params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
            //     //params.view = 'internal';
            // }

            // Fetching the sort by parameter from localstorage
            if (CaseService.localStorageCache) {
                if (CaseService.localStorageCache.get('filterSelect' + securityService.loginStatus.authedUser.sso_username)) {
                    var filterSelectCache = CaseService.localStorageCache.get('filterSelect' + securityService.loginStatus.authedUser.sso_username);
                    CaseService.setFilterSelectModel(filterSelectCache.sortField, filterSelectCache.sortOrder);
                }
            }
            this.searching = true;
            if (this.caseParameters.searchTerm === undefined || this.caseParameters.searchTerm === '') {
                var params = {
                    count: this.pageSize,
                    include_closed: getIncludeClosed(this.caseParameters)
                };
                if (COMMON_CONFIG.isGS4 === true) {
                    params.account_number = "639769";
                }
                params.start = this.currentPage * this.pageSize;

                //if (!RHAUtils.isEmpty(this.caseParameters.searchTerm)) {
                //    params.keyword = this.caseParameters.searchTerm;
                //}
                if (this.caseParameters.group === CASE_GROUPS.ungrouped || this.caseParameters.group === "-1") {
                    params.only_ungrouped = true;
                } else if (!RHAUtils.isEmpty(this.caseParameters.group)) {
                    params.group_numbers = {group_number: [this.caseParameters.group]};
                }
                if (this.caseParameters.status === STATUS.closed) {
                    params.status = STATUS.closed;
                }
                // Not doing product based searching
                // if (!RHAUtils.isEmpty(CaseService.product)) {
                //     params.product = CaseService.product;
                // }
                if (!RHAUtils.isEmpty(CaseService.filterSelect.sortField)) {
                    if (CaseService.filterSelect.sortField === 'owner') {
                        params.sort_field = 'contactName';
                    } else {
                        params.sort_field = CaseService.filterSelect.sortField;
                    }
                }
                if (!RHAUtils.isEmpty(CaseService.filterSelect.sortOrder)) {
                    //This is a hack because strata returns the severities in reverse order
                    if ((CaseService.filterSelect.sortField === 'severity' || CaseService.filterSelect.sortField === 'status') && CaseService.filterSelect.sortOrder === 'ASC') {
                        params.sort_order = 'DESC';
                    } else if ((CaseService.filterSelect.sortField === 'severity' || CaseService.filterSelect.sortField === 'status') && CaseService.filterSelect.sortOrder === 'DESC') {
                        params.sort_order = 'ASC';
                    } else {
                        params.sort_order = CaseService.filterSelect.sortOrder;
                    }
                }
                // if (!RHAUtils.isEmpty(CaseService.owner)) {
                //     params.owner_ssoname = CaseService.owner;
                // }
                if (!RHAUtils.isEmpty(CaseService.type)) {
                    params.type = CaseService.type;
                }
                if (!RHAUtils.isEmpty(CaseService.severity)) {
                    params.severity = CaseService.severity;
                }
                if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && checkIsInternal === undefined && RHAUtils.isEmpty(CaseService.bookmarkedAccount) || checkIsInternal === true) {
                    params.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                    params.view = 'internal';
                }
                if (RHAUtils.isNotEmpty(CaseService.bookmarkedAccount)) {
                    params.account_number = CaseService.bookmarkedAccount;
                }
                if (this.refreshFilterCache === true) {
                    strataService.cache.clr('filter' + JSON.stringify(params));
                    this.refreshFilterCache = false;
                }
                strataService.cases.filter(params).then((response) => {
                    if (response['case'] === undefined) {
                        this.totalCases = 0;
                        this.total = 0;
                        this.allCasesDownloaded = true;
                    } else {
                        this.totalCases = response.total_count;
                        if (response['case'] !== undefined && response['case'].length + this.total >= this.totalCases) {
                            this.allCasesDownloaded = true;
                        }
                        if (response['case'] !== undefined && this.total < this.totalCases) {
                            Array.prototype.push.apply(this.cases, response['case']);
                            this.total = this.total + response['case'].length;
                        }
                    }
                    deferred.resolve(cases);
                }, (error) => {
                    this.totalCases = 0;
                    this.total = 0;
                    this.allCasesDownloaded = true;
                    if (error.xhr.status === 404) {
                        this.doFilter(false).then(() => deferred.resolve(cases));
                    } else {
                        AlertService.addStrataErrorMessage(error);
                        deferred.resolve(cases);
                    }
                }).finally(() => {
                    this.searching = false;
                });
            } else {
                var sortField = CaseService.filterSelect.sortField;
                if (sortField === "owner") {
                    sortField = "contactName";
                }

                strataService.cases.search(this.caseParameters.status, null, this.caseParameters.group, CaseService.bookmarkedAccount, this.caseParameters.searchTerm, sortField, CaseService.filterSelect.sortOrder, this.currentPage * this.pageSize, this.pageSize, null, null).then((response) => {
                    if (response['case'] === undefined) {
                        this.totalCases = 0;
                        this.total = 0;
                        this.allCasesDownloaded = true;
                    } else {
                        this.totalCases = response.total_count;
                        if (response['case'] !== undefined && response['case'].length + this.total >= this.totalCases) {
                            this.allCasesDownloaded = true;
                        }
                        if (response['case'] !== undefined && this.total < this.totalCases) {
                            Array.prototype.push.apply(this.cases, response['case']);
                            this.total = this.total + response['case'].length;
                        }
                    }
                    deferred.resolve(cases);
                }, (error) => {
                    this.totalCases = 0;
                    this.total = 0;
                    this.allCasesDownloaded = true;
                    if (error.xhr.status === 404) {
                        this.doFilter(false).then(() => deferred.resolve(cases));
                    } else {
                        AlertService.addStrataErrorMessage(error);
                        deferred.resolve(cases);
                    }
                }).finally(() => {
                    this.searching = false;
                });
            }
            return deferred.promise;
        };
    }
}
