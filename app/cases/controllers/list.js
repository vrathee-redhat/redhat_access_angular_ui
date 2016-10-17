'use strict';

export default class List {
    constructor($scope, $filter, $location, $state, $uibModal, securityService, AlertService, SearchCaseService, CaseService, strataService, AUTH_EVENTS, NEW_CASE_CONFIG, CASE_EVENTS, CASE_GROUPS, STATUS, gettextCatalog, RHAUtils) {
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
        $scope.displayedCaseText = 'Open Support Cases';
        $scope.RHAUtils = RHAUtils;

        $scope.exports = function () {
            $scope.exporting = true;
            strataService.cases.csv().then((response) => {
                $scope.exporting = false;
                var blob = new Blob([response], {type: 'text/csv'});
                if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveOrOpenBlob(blob, "caseList.csv");
                }
                else {
                    var blobURL = (window.URL || window.webkitURL).createObjectURL(blob);
                    var anchor = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
                    anchor.download = "caseList.csv";
                    anchor.href = blobURL;
                    var event = document.createEvent("MouseEvents");
                    event.initEvent("click", true, false);
                    anchor.dispatchEvent(event);
                }
            }, (error) => {
                $scope.exporting = false;
                AlertService.addStrataErrorMessage(error);
            });
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
                    ['Support', '/support/'],
                    ['Support Cases', '/support/cases/'],
                    ['List']
                ];
                updateBreadCrumb();
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
