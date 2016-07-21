'use strict';

export default class StatusSelect {
    constructor($scope, securityService, CaseService, STATUS, gettextCatalog) {
        'ngInject';

        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.STATUS = STATUS;
        $scope.statuses = [
            {
                name: gettextCatalog.getString('Open and Closed'),
                value: STATUS.both
            },
            {
                name: gettextCatalog.getString('Open'),
                value: STATUS.open
            },
            {
                name: gettextCatalog.getString('Closed'),
                value: STATUS.closed
            }
        ];
    }
}
