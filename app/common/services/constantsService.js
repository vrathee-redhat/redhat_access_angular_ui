'use strict';
angular.module('RedhatAccess.common').service('ConstantsService', [
    'securityService',
    'translate',
    'STATUS',
    function (securityService, translate, STATUS) {
        this.sortByParams = [
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
        this.statuses = [
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