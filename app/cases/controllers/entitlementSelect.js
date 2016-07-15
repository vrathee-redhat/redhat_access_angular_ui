'use strict';

export default class EntitlementSelect {
    constructor($scope, CaseService) {
        'ngInject';

        $scope.CaseService = CaseService;
        CaseService.populateEntitlements();
    }
}
