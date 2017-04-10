'use strict';

export default class SearchCaseService {
    constructor(CaseService, strataService, AlertService, STATUS, CASE_GROUPS, $q, SearchBoxService, securityService, COMMON_CONFIG, RHAUtils) {
        'ngInject';
        this.cases = [];
        this.totalCases = 0;
        this.searching = true;
        this.searching404 = false;
        this.start = 0;
        this.total = 0;
        this.refreshFilterCache = false;
        this.previousGroupFilter = CASE_GROUPS.none;
        this.currentPage = 1;
        this.pageSize = 50;
        this.numberOfPages = function() {
            return Math.ceil(this.totalCases / this.pageSize);
        };

        this.clear = function() {
            this.cases = [];
            SearchBoxService.searchTerm = '';
            this.start = 0;
            this.total = 0;
            this.totalCases = 0;
            this.searching = false;
        };

        // For displaying where we are at in the pagination
        this.getCasesStart = () => {
            return (this.currentPage - 1) * this.pageSize + 1;
        };

        this.getCasesEnd = () => {
            const end = this.currentPage * this.pageSize;
            if (end > this.totalCases) {
                return this.totalCases;
            }
            return end;
        };

        this.clearPagination = function() {
            this.start = 0;
            this.total = 0;
            this.allCasesDownloaded = false;
            this.cases = [];
            this.totalCases = 0;
        };

        this.searchParameters = {
            caseStatus: STATUS.open,
            caseOwner: null,
            caseGroup: null,
            accountNumber: null,
            searchString: null,
            offset: (this.currentPage - 1) * this.pageSize,
            limit: this.pageSize,
            queryParams: null,
        };

        this.makeCaseFilter = function() {
            const caseFilter = {};
            caseFilter.count = this.searchParameters.limit;
            caseFilter.include_closed = this.searchParameters.caseStatus !== STATUS.open;
            caseFilter.start = this.searchParameters.offset;

            if (!RHAUtils.isEmpty(CaseService.filterSelect.sortField)) {
                if (CaseService.filterSelect.sortField === 'owner') {
                    caseFilter.sort_field = 'contactName';
                } else {
                    caseFilter.sort_field = CaseService.filterSelect.sortField;
                }
            }

            if (!RHAUtils.isEmpty(CaseService.filterSelect.sortOrder)) {
                //This is a hack because strata returns the severities in reverse order
                if ((CaseService.filterSelect.sortField === 'severity' || CaseService.filterSelect.sortField === 'status') && CaseService.filterSelect.sortOrder === 'ASC') {
                    caseFilter.sort_order = 'DESC';
                } else if ((CaseService.filterSelect.sortField === 'severity' || CaseService.filterSelect.sortField === 'status') && CaseService.filterSelect.sortOrder === 'DESC') {
                    caseFilter.sort_order = 'ASC';
                } else {
                    caseFilter.sort_order = CaseService.filterSelect.sortOrder;
                }
            }

            if (!RHAUtils.isEmpty(CaseService.type)) {
                caseFilter.type = CaseService.type;
            }
            if (!RHAUtils.isEmpty(CaseService.severity)) {
                caseFilter.severity = CaseService.severity;
            }
            if (this.searchParameters.caseStatus === STATUS.closed) {
                caseFilter.status = STATUS.closed;
            }
            if (COMMON_CONFIG.isGS4 === true) {
                caseFilter.account_number = '639769';
            }

            if (!COMMON_CONFIG.isGS4 && securityService.loginStatus.authedUser.sso_username && securityService.loginStatus.authedUser.is_internal && RHAUtils.isEmpty(this.searchParameters.accountNumber)) {
                caseFilter.associate_ssoname = securityService.loginStatus.authedUser.sso_username;
                caseFilter.view = 'internal';
            }
            if (RHAUtils.isNotEmpty(this.searchParameters.accountNumber)) {
                caseFilter.account_number = this.searchParameters.accountNumber;
            }

            if (this.searchParameters.caseGroup === CASE_GROUPS.ungrouped || this.searchParameters.caseGroup === '-1') {
                caseFilter.only_ungrouped = true;
            } else if (!RHAUtils.isEmpty(this.searchParameters.caseGroup)) {
                caseFilter.group_numbers = {
                    group_number: [this.searchParameters.caseGroup]
                };
            }

            return caseFilter;

        }

        this.onSuccess = (response, deferred) => {
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
            this.searching404 = false;
            deferred.resolve();
        }

        this.onFailure = (error, deferred) => {
            this.totalCases = 0;
            this.total = 0;
            this.allCasesDownloaded = true;
            if (error.xhr.status === 404 && !this.searching404) {
                this.searching404 = true;
                this.doFilter().then(() => deferred.resolve());
            } else {
                this.searching404 = false;
                AlertService.addStrataErrorMessage(error);
                deferred.resolve();
            }
        }

        this.doFilter = function() {
            this.searching = true;
            this.previousGroupFilter = this.searchParameters.caseGroup;

            if (CaseService.localStorageCache) {
                CaseService.localStorageCache.put('listFilter' + securityService.loginStatus.authedUser.sso_username, this.searchParameters);
            }
            if (RHAUtils.isEmpty(this.searchParameters.searchString)) {
                return this.doCaseFilter();
            } else {
                return this.doCaseSearch();
            }
        }

        this.doCaseSearch = function() {
            const deferred = $q.defer();
            let sortField = CaseService.filterSelect.sortField === 'owner' ? 'contactName' : CaseService.filterSelect.sortField;
            strataService.cases.search(
                this.searchParameters.caseStatus,
                this.searchParameters.caseOwner,
                this.searchParameters.caseGroup,
                this.searchParameters.accountNumber,
                this.searchParameters.searchString,
                sortField,
                CaseService.filterSelect.sortOrder,
                this.searchParameters.offset,
                this.searchParameters.limit,
                this.searchParameters.queryParams,
            ).then(
                (response) => this.onSuccess(response, deferred),
                (error) => this.onFailure(error, deferred)
            ).finally(() => {
                this.searching = this.searching404 ? true : this.searching = false;
            });
            return deferred.promise;
        }

        this.doCaseFilter = function() {
            const deferred = $q.defer();
            const caseFilter = this.makeCaseFilter();
            if (this.refreshFilterCache === true) {
                strataService.cache.clr('filter' + JSON.stringify(caseFilter));
                this.refreshFilterCache = false;
            }
            strataService.cases.filter(caseFilter).then(
                (response) => this.onSuccess(response, deferred),
                (error) => this.onFailure(error, deferred)
            ).finally(() => {
                this.searching = this.searching404 ? true : this.searching = false;
            });
            return deferred.promise;
        }
    }

}
