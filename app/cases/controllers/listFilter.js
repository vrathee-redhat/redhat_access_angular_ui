'use strict';
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('ListFilter', [
    '$scope',
    '$rootScope',
    'STATUS',
    'SearchCaseService',
    'SearchBoxService',
    'CaseService',
    'GroupService',
    'securityService',
    'translate',
    'CASE_EVENTS',
    function ($scope, $rootScope, STATUS, SearchCaseService, SearchBoxService, CaseService, GroupService, securityService, translate, CASE_EVENTS) {
        $scope.CaseService = CaseService;
        $scope.GroupService = GroupService;
        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        CaseService.status = STATUS.open;
        $scope.showsearchoptions = CaseService.showsearchoptions;
        $scope.statuses = [
            {
                name: translate('Open and Closed'),
                value: STATUS.both
            },
            {
                name: translate('Open'),
                value: STATUS.open
            },
            {
                name: translate('Closed'),
                value: STATUS.closed
            }
        ];
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