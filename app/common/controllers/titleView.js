'use strict';
angular.module('RedhatAccess.header').controller('TitleViewCtrl', [
    'COMMON_CONFIG',
    '$scope',
    'translate',
    'CaseService',
    function (COMMON_CONFIG, $scope, translate, CaseService) {
        $scope.COMMON_CONFIG = COMMON_CONFIG;
        $scope.showTitle = COMMON_CONFIG.show;
        $scope.titlePrefix = COMMON_CONFIG.titlePrefix;
        $scope.CaseService = CaseService;
        $scope.getPageTitle = function () {
            switch ($scope.page) {
            case 'search':
                return translate('Search');
            case 'caseList':
                return translate('SUPPORT CASES');
            case 'caseView':
                return translate('CASE ') + CaseService.kase.case_number;
            case 'newCase':
                return translate('CREATE A NEW SUPPORT CASE');
            case 'logViewer':
                return translate('Logs');
            case 'searchCase':
                return translate('Search Support Case');
            case 'manageGroups':
                return translate('Manage Case Groups');
            case 'editGroup':
                return translate('Manage Default Case Groups');
            default:
                return '';
            }
        };
    }
]);