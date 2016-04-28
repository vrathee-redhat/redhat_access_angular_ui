'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ListFilter', [
    '$scope',
    'STATUS',
    'CaseService',
    'securityService',
    '$rootScope',
    'CASE_EVENTS',
    'SearchCaseService',
    'GroupService',
    'ConstantsService',
    'RHAUtils',
    '$state',
    function ($scope, STATUS, CaseService, securityService, $rootScope, CASE_EVENTS, SearchCaseService, GroupService, ConstantsService, RHAUtils, $state) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.GroupService = GroupService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.ConstantsService = ConstantsService;
        CaseService.status = STATUS.open;
        $scope.showsearchoptions = CaseService.showsearchoptions;
        $scope.bookmarkAccountUrl = $state.href('accountBookmark');

        $scope.doSearch = function(){
            $rootScope.$broadcast(CASE_EVENTS.searchSubmit);
        };
        $scope.setSearchOptions = function (showsearchoptions) {
            CaseService.showsearchoptions = showsearchoptions;
            CaseService.buildGroupOptions();            
        };
        $scope.clearSearch = function () {
            SearchCaseService.caseParameters.searchTerm = undefined;
        };
    }
]);
