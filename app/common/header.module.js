angular.module('RedhatAccess.header', [])
    .value('HEADER_VIEW_CONFIG', {
        show: 'false'

    }).controller('HeaderViewCtrl', ['HEADER_VIEW_CONFIG', '$scope',
        function(HEADER_VIEW_CONFIG, $scope) {
            $scope.showHeader = HEADER_VIEW_CONFIG.show;
        }
    ]).directive('rhaHeaderTemplate', function() {
        return {
            restrict: 'AE',
            scope: {
                pageTitle: '@title'
            },
            templateUrl: 'common/views/header.html',
            controller: 'HeaderViewCtrl'
        };
    });