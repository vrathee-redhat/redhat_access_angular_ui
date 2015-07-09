'use strict';
angular.module('RedhatAccess.cases').controller('StatusSelect', [
    '$scope',
    'securityService',
    'CaseService',
    'STATUS',
    'gettextCatalog',
    function ($scope, securityService, CaseService, STATUS, gettextCatalog) {
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
]);
