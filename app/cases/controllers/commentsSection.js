'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('CommentsSection', [
    '$scope',
    'CaseService',
    'strataService',
    'securityService',
    '$stateParams',
    '$rootScope',
    'AUTH_EVENTS',
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    function ($scope, CaseService, strataService,securityService, $stateParams,$rootScope,AUTH_EVENTS, AlertService, $modal, $location, $anchorScroll, RHAUtils) {
        $scope.CaseService = CaseService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;

        $scope.authLoginEvent = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.firePageLoadEvent();
            CaseService.populateComments($stateParams.id).then(function (comments) {
                $scope.$on('rhaCaseSettled', function() {
                    $scope.$evalAsync(function() {
                        CaseService.scrollToComment($location.search().commentId);
                    });
                });
            });
        });

        $scope.firePageLoadEvent = function () {
            if (window.chrometwo_require !== undefined) {
                chrometwo_require(['analytics/attributes', 'analytics/main'], function(attrs, paf) {
                    attrs.harvest();
                    paf.report();
                });
            }
        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.firePageLoadEvent();
            CaseService.populateComments($stateParams.id).then(function (comments) {
                $scope.$on('rhaCaseSettled', function() {
                    $scope.$evalAsync(function() {
                        CaseService.scrollToComment($location.search().commentId);
                    });
                });
            });
        }


        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };
    }
]);
