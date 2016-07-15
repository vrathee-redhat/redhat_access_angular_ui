'use strict';

export default class FilterSelect {
    constructor($scope, securityService, CaseService, STATUS, ConstantsService) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.ConstantsService = ConstantsService;
        $scope.STATUS = STATUS;
        $scope.init = function () {
            CaseService.filterSelect = ConstantsService.sortByParams[0];
            if (CaseService.localStorageCache) {
                if (CaseService.localStorageCache.get('filterSelect' + securityService.loginStatus.authedUser.sso_username)) {
                    var filterSelectCache = CaseService.localStorageCache.get('filterSelect' + securityService.loginStatus.authedUser.sso_username);
                    CaseService.setFilterSelectModel(filterSelectCache.sortField, filterSelectCache.sortOrder);
                }
            }
        };
    }
}
