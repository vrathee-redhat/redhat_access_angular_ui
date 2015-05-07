'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ListFilter', [
    '$scope',
    'STATUS',
    'CaseService',
    'securityService',
    'GroupService',
    'SearchCaseService',
    'translate',
    'CASE_EVENTS',
    '$rootScope',
    'ConstantsService',
    function ($scope, STATUS, CaseService, securityService, GroupService, SearchCaseService, translate, CASE_EVENTS, $rootScope, ConstantsService) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.GroupService = GroupService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.ConstantsService = ConstantsService;
        CaseService.status = STATUS.open;
        $scope.showsearchoptions = CaseService.showsearchoptions;        
        $scope.doSearch = function(){
            $rootScope.$broadcast(CASE_EVENTS.searchSubmit);
        }        
        $scope.setSearchOptions = function (showsearchoptions) {
            CaseService.showsearchoptions = showsearchoptions;
            if(CaseService.groups.length === 0){
                CaseService.populateGroups().then(function (){
                    CaseService.buildGroupOptions();
                });
            } else{
                CaseService.buildGroupOptions();
            }
        };
    }
]);