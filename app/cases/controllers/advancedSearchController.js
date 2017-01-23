'use strict';

import find from 'lodash/find'
import clone from 'lodash/clone'
import sortBy from 'lodash/sortBy'

export default class AdvancedSearchController {
    constructor($scope, AdvancedCaseSearchService, RHAUtils, securityService, CaseService, CASE_EVENTS, $state,
    SearchBookmarkService, $stateParams, SOLRGrammarService, AUTH_EVENTS, $timeout, $uibModal, $rootScope, gettextCatalog) {
        'ngInject';

        $scope.solrQuery = $stateParams.query || "";
        $scope.queryParsed = false;
        $scope.AdvancedCaseSearchService = AdvancedCaseSearchService;
        $scope.RHAUtils = RHAUtils;
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.bookmarks = [];

        const init = () => {
            $scope.bookmarks = sortBy(SearchBookmarkService.getAllBookmarks(), 'name');
            const bookmark = find($scope.bookmarks, { id: $stateParams.bookmark });

            if (bookmark) {
                $scope.selectedBookmark = bookmark;
                // Make sure we have correct query and sort order in URL
                $state.go('advancedSearch', { bookmark: bookmark.id, query: bookmark.query, sortBy: `${bookmark.sort.sortField}_${bookmark.sort.sortOrder}`});
            } else {
                $state.go('advancedSearch', { bookmark: null }, {location: 'replace', notify: false});
            }

            $scope.$watch('selectedBookmark', (newBookmark, oldBookmark) => {
                if (newBookmark) {
                    if ($stateParams.bookmark !== newBookmark.id) {
                        if ($scope.searchChangedAgainstBookmark(oldBookmark)) {
                            const scope = $rootScope.$new();
                            scope.message = gettextCatalog.getString("All unsaved changes will be overwritten.");
                            $uibModal.open({
                                template: require('../views/confirmationModal.jade'),
                                scope: scope
                            }).result.then(
                                () => $state.go('advancedSearch', { bookmark: newBookmark.id, query: newBookmark.query, sortBy: `${newBookmark.sort.sortField}_${newBookmark.sort.sortOrder}` }),
                                () => $scope.selectedBookmark = oldBookmark
                            );
                        } else {
                            $state.go('advancedSearch', { bookmark: newBookmark.id, query: newBookmark.query, sortBy: `${newBookmark.sort.sortField}_${newBookmark.sort.sortOrder}` });
                        }
                    }
                } else {
                    $state.go('advancedSearch', { bookmark: null });
                }
            });

            if ($scope.solrQuery != null && SOLRGrammarService.parseSafe($scope.solrQuery) != null) {
                const search = () => {
                    AdvancedCaseSearchService.clearColumns(); // reset columns just before search is started to prevent UI glitches
                    $scope.submitSearch(); // Delay the search, so that rha-filterselect is initiated
                };
                if(CaseService.filterSelect) {
                    search();
                } else {
                    const removeListener = $scope.$on(CASE_EVENTS.filterInitialized, () => {
                        search();
                        removeListener();
                    });
                }
            }
        };

        $scope.submitSearch = () => {
            if ($scope.solrQuery !== null) {
                const query = SOLRGrammarService.parseSafe($scope.solrQuery);
                if(query != null && AdvancedCaseSearchService.query != query) {
                    $scope.$broadcast(CASE_EVENTS.advancedSearchSubmitted);
                    AdvancedCaseSearchService.currentPage = 1;
                    AdvancedCaseSearchService.performSearch(query, CaseService.filterSelect);
                }
            }
        };

        $scope.doSearch = () => {
            AdvancedCaseSearchService.performSearch(AdvancedCaseSearchService.query, CaseService.filterSelect);
        };

        $scope.searchChangedAgainstBookmark = (bookmark) => {
            const currentBookmark = bookmark || $scope.selectedBookmark;
            return (
                RHAUtils.isNotEmpty($scope.solrQuery) && (
                    RHAUtils.isEmpty(currentBookmark)
                    || currentBookmark.query !== $scope.solrQuery
                    || currentBookmark.sort.sortField !== CaseService.filterSelect.sortField
                    || currentBookmark.sort.sortOrder !== CaseService.filterSelect.sortOrder
                )
            );
        };

        $scope.queryEmpty = () => RHAUtils.isEmpty($scope.solrQuery);

        $scope.bookmarkSearch = () => {
            $uibModal.open({
                template: require('../views/searchBookmarkModal.jade'),
                controller: 'SearchBookmarkModal',
                resolve: {
                    query: () => $scope.solrQuery,
                    sort: () => CaseService.filterSelect,
                    bookmark: () => clone($scope.selectedBookmark)
                }
            }).result.then((bookmark) => {
                $state.go('advancedSearch', {bookmark: bookmark.id}, {inherit:false});
            });
        };

        $scope.searchChanged = () => $scope.solrQuery != null &&
                                    (SOLRGrammarService.parseSafe($scope.solrQuery) !== AdvancedCaseSearchService.query
                                    || AdvancedCaseSearchService.resolveOrder(CaseService.filterSelect) !== AdvancedCaseSearchService.order);

        $scope.removeSearchBookmark = () => {
            if($scope.selectedBookmark) {
                let modalInstance;
                const scope = $rootScope.$new();
                scope.message = gettextCatalog.getString("Are you sure you want to delete this bookmark?");
                modalInstance = $uibModal.open({
                    template: require('../views/confirmationModal.jade'),
                    scope: scope
                });
                modalInstance.result.then(() => {
                    SearchBookmarkService.deleteBookmark($scope.selectedBookmark.id);
                    $state.go("advancedSearch", {bookmark:null}, {location: 'replace'});
                });
            }

        };

        $scope.bookmarkPublicLink = () => {
            if($scope.selectedBookmark) {
                const bm = $scope.selectedBookmark;
                return $state.href("advancedSearch", {query: bm.query, sortBy: `${bm.sort.sortField}_${bm.sort.sortOrder}`}, {inherit:false});
            }
        };

        $scope.exportCsv = () => {
            if(AdvancedCaseSearchService.totalCases != null && AdvancedCaseSearchService.totalCases > 10000) {
                let modalScope = $rootScope.$new();
                modalScope.message = gettextCatalog.getString('You are trying to export {{numberOfCases}} cases, but only the first 10000 cases will be exported. It is advised you refine the search to match less than 10000 cases before exporting. \n Would you like to proceed?', {numberOfCases: AdvancedCaseSearchService.totalCases})
                $uibModal.open({
                    template: require('../views/confirmationModal.jade'),
                    scope: modalScope
                }).result.then(() => {
                    AdvancedCaseSearchService.initiateCSVDownload();
                });
            } else {
                AdvancedCaseSearchService.initiateCSVDownload();
            }
        }

        $scope.$watch('CaseService.filterSelect', function (filter) {
            if(filter) {
                // Update filter in the URL
                $state.go('advancedSearch', {sortBy: `${filter.sortField}_${filter.sortOrder}`}, {
                    notify: false,
                    reload: false
                });
                if (AdvancedCaseSearchService.resolveOrder(filter) !== AdvancedCaseSearchService.order) {
                    // not to fire the search on controller init, only fire when filter has actually changed
                    AdvancedCaseSearchService.performSearch(AdvancedCaseSearchService.query, filter);
                }
            }
        });

        // INIT
        if (securityService.loginStatus.isLoggedIn) {
            init();
        }
        $scope.$on(AUTH_EVENTS.loginSuccess, init);


        // set breadcrumbs
        if (window.chrometwo_require !== undefined) {
            breadcrumbs = [
                ['Support', '/support/'],
                ['Support Cases', '/support/cases/'],
                ['Search']
            ];
            updateBreadCrumb();
        }
    }
}
