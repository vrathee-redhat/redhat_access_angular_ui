'use strict';

export default class OwnerSelect {
    constructor($scope, securityService, SearchCaseService, CaseService) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.SearchCaseService = SearchCaseService;
        $scope.CaseService = CaseService;
    }
}
