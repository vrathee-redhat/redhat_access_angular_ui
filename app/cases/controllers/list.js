'use strict';

import * as FileSaver from 'filesaver.js'

export default class List {
    constructor($scope, $filter, $location, $state, $uibModal, securityService, AlertService, SearchCaseService, CaseService, strataService, AUTH_EVENTS, NEW_CASE_CONFIG, CASE_EVENTS, CASE_GROUPS, STATUS, gettextCatalog, RHAUtils, HeaderService) {
        'ngInject';

        $scope.busy = false;
        $scope.SearchCaseService = SearchCaseService;
        $scope.securityService = securityService;
        $scope.AlertService = AlertService;
        $scope.CaseService = CaseService;
        $scope.NEW_CASE_CONFIG = NEW_CASE_CONFIG;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.exporting = false;
        $scope.fetching = false;
        $scope.displayedCaseText = gettextCatalog.getString('Open Support Cases');
        $scope.RHAUtils = RHAUtils;

        $scope.showCaseList = () => securityService.loginStatus.isLoggedIn && !HeaderService.pageLoadFailure && CaseService.sfdcIsHealthy && securityService.loginStatus.userAllowedToManageCases;

        $scope.exports = async function () {
            $scope.exporting = true;

            try {
                const query = `case_accountNumber:${this.securityService.loginStatus.authedUser.account.number}`;
                const response = await strataService.cases.advancedSearch(query, null, 0, 10000, 'csv');
                const csvBlob = new Blob([response], {type: 'text/csv'});
                FileSaver.saveAs(csvBlob, 'caseList.csv');
            } catch (error) {
                AlertService.addStrataErrorMessage(error);
            }

            $scope.exporting = false;
        };

        $scope.$on(CASE_EVENTS.searchSubmit, () => {
            SearchCaseService.currentPage = 1;
            $scope.doSearch()
        });

        $scope.doSearch = function () {
            SearchCaseService.clearPagination();
            if (SearchCaseService.caseParameters.group === CASE_GROUPS.manage) {
                SearchCaseService.caseParameters.group = SearchCaseService.previousGroupFilter;
                $state.go('group');
            } else {
                if (CaseService.groups.length === 0) {
                    CaseService.populateGroups().then(() => {
                        if (SearchCaseService.previousGroupFilter === CASE_GROUPS.none) {
                            SearchCaseService.caseParameters.group = CaseService.group;
                        } else {
                            SearchCaseService.caseParameters.group = SearchCaseService.previousGroupFilter;
                        }
                        $scope.busy = true;
                        return SearchCaseService.doFilter().then(() => {
                            $scope.busy = false;
                        });
                    });
                } else {
                    if (SearchCaseService.previousGroupFilter === CASE_GROUPS.none) {
                        SearchCaseService.caseParameters.group = CaseService.group;
                    }
                    $scope.busy = true;
                    return SearchCaseService.doFilter().then(() => {
                        $scope.busy = false;
                    });
                }
            }
        };

        $scope.firePageLoadEvent = function () {
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/attributes', 'analytics/main'], (attrs, paf) => {
                    attrs.harvest();
                    paf.report();
                });
            }
        };

        $scope.setBreadcrumbs = function () {
            if (window.chrometwo_require !== undefined) {
                breadcrumbs = [
                    [gettextCatalog.getString('Support'), '/support/'],
                    [gettextCatalog.getString('Support Cases'), '/support/cases/'],
                    [gettextCatalog.getString('List')]
                ];
                updateBreadCrumb();
                document.title = gettextCatalog.getString('Support Cases - Portal Case Management');
            }
        };

        /**
         * Callback after user login. Load the cases and clear alerts
         */
        if (securityService.loginStatus.isLoggedIn && securityService.loginStatus.userAllowedToManageCases) {
            $scope.firePageLoadEvent();
            //SearchCaseService.clear();
            if (CaseService.status === undefined) {
                CaseService.status = 'open';
            }
            if(RHAUtils.isEmpty(SearchCaseService.cases)) $scope.doSearch();
            $scope.setBreadcrumbs();
        }
        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            if (securityService.loginStatus.userAllowedToManageCases) {
                $scope.firePageLoadEvent();
                CaseService.status = 'open';
                if(RHAUtils.isEmpty(SearchCaseService.cases)) $scope.doSearch();
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

        $scope.caseChosen = function () {
            var trues = $filter('filter')(SearchCaseService.cases, {selected: true});
            return trues.length;
        };

        $scope.closeCases = function () {
            CaseService.confirmationModal = CASE_EVENTS.caseClose;
            CaseService.confirmationModalHeader = gettextCatalog.getString('Closing Cases.');
            CaseService.confirmationModalMessage = gettextCatalog.getString('Are you sure you want to close the selected cases?');
            $uibModal.open({
                template: require('../views/commonConfirmationModal.jade'),
                controller: 'CommonConfirmationModal'
            });
        };

        $scope.getCasesText = function () {
            if (SearchCaseService.caseParameters.status === STATUS.open) {
                $scope.displayedCaseText = gettextCatalog.getString('Open Support Cases');
            } else if (SearchCaseService.caseParameters.status === STATUS.closed) {
                $scope.displayedCaseText = gettextCatalog.getString('Closed Support Cases');
            } else if (SearchCaseService.caseParameters.status === STATUS.both) {
                $scope.displayedCaseText = gettextCatalog.getString('Open and Closed Support Cases');
            }
        };

        $scope.loadingRecWatcher = $scope.$watch('SearchCaseService.caseParameters.status', function (newVal) {
            $scope.getCasesText();
        });
    }
}
