'use strict';

export default class ListBugzillas {
    constructor($scope, CaseService, securityService) {
        'ngInject';

        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
    }
}
