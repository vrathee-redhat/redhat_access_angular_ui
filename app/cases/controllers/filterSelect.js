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
                name: translate('Newest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'DESC'
            },
            {
                name: translate('Oldest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'ASC'
            },
            {
                name: translate('Highest Severity'),
                sortField: 'severity',
                sortOrder: 'ASC'
            },
            {
                name: translate('Lowest Severity'),
                sortField: 'severity',
                sortOrder: 'DESC'
            },
            {
                name: translate('Newest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'DESC'
            },
            {
                name: translate('Oldest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'ASC'
            },
            {
                name: translate('Case Owner (A-Z)'),
                sortField: 'owner',
                sortOrder: 'DESC'
            },
            {
                name: translate('Case Owner (Z-A)'),
                sortField: 'owner',
                sortOrder: 'ASC'
            }
        ];
    }
]);
