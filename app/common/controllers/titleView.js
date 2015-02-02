'use strict';
angular.module('RedhatAccess.header').controller('TitleViewCtrl', [
    'TITLE_VIEW_CONFIG',
    '$scope',
    'translate',
    function (TITLE_VIEW_CONFIG, $scope, translate) {
        $scope.showTitle = TITLE_VIEW_CONFIG.show;
        $scope.titlePrefix = TITLE_VIEW_CONFIG.titlePrefix;
        $scope.getPageTitle = function () {
            switch ($scope.page) {
            case 'search':
                return translate('Search');
            case 'caseList':
                return translate('Support Cases');
            case 'caseView':
                return translate('View/Modify Case');
            case 'newCase':
                return translate('New Support Case');
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