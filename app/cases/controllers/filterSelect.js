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
                name: translate('Sort by Newest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'DSC'
            },
            {
                name: translate('Sort by Oldest Date Modified'),
                sortField: 'lastModifiedDate',
                sortOrder: 'ASC'
            },
            {
                name: translate('Sort by Highest Severity'),
                sortField: 'severity',
                sortOrder: 'DESC'
            },
            {
                name: translate('Sort by Lowest Severity'),
                sortField: 'severity',
                sortOrder: 'ASC'
            },
            {
                name: translate('Sort by Newest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'DESC'
            },
            {
                name: translate('Sort by Oldest Date Created'),
                sortField: 'createdDate',
                sortOrder: 'ASC'
            }
        ];
    }
]);
