/*jshint camelcase: false */
'use strict';
angular.module('RedhatAccess.cases').controller('FilterSelect', [
    '$scope',
    'securityService',
    'CaseService',
    'STATUS',
    'translate',
    'ConstantsService',
    function ($scope, securityService, CaseService, STATUS, translate, ConstantsService) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.ConstantsService = ConstantsService;
        $scope.STATUS = STATUS;
        $scope.init = function() {
            CaseService.filterSelect = ConstantsService.statuses[0];
            if(CaseService.localStorageCache) {
                if (CaseService.localStorageCache.get('filterSelect'+securityService.loginStatus.authedUser.sso_username)) {
                    var filterSelectCache = CaseService.localStorageCache.get('filterSelect'+securityService.loginStatus.authedUser.sso_username);
                    CaseService.setFilterSelectModel(filterSelectCache.sortField,filterSelectCache.sortOrder);
                }
            }
        };
    }
]);