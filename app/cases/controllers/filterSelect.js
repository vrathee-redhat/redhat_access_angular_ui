/*jshint camelcase: false */
'use strict';
angular.module('RedhatAccess.cases').controller('FilterSelect', [
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
                name: translate('Sort by Last Modified: Descending'),
                sortField: 'lastModifiedDate',
                sortOrder: 'DESC'
            },
            {
                name: translate('Sort by Last Modified: Asecnding'),
                sortField: 'lastModifiedDate',
                sortOrder: 'ASC'
            },
            {
                name: translate('Sort by Severity: Lowest to Highest'),
                sortField: 'severity',
                sortOrder: 'DESC'
            },
            {
                name: translate('Sort by Severity: Highest to Lowest'),
                sortField: 'severity',
                sortOrder: 'ASC'
            },
            {
                name: translate('Sort by Created: Descending'),
                sortField: 'createdDate',
                sortOrder: 'DESC'
            },
            {
                name: translate('Sort by Created: Asecnding'),
                sortField: 'createdDate',
                sortOrder: 'ASC'
            }
        ];
    }
]);
