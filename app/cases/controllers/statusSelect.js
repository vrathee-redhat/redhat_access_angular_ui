'use strict';
angular.module('RedhatAccess.cases').controller('StatusSelect', [
    '$scope',
    'securityService',
    'CaseService',
    'STATUS',
    'translate',
    function ($scope, securityService, CaseService, STATUS, translate) {
        $scope.securityService = securityService;
        $scope.CaseService = CaseService;
        $scope.STATUS = STATUS;
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
    }
]);
