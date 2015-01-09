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


        var populateComments = function () {
            CaseService.populateComments($stateParams.id).then(function (comments) {
                $scope.$on('rhaCaseSettled', function() {
                    $scope.$evalAsync(function() {
                        CaseService.scrollToComment($location.search().commentId);
                    });
                });
            });
        };

        $scope.assignCommentsText=function(text) {
                CaseService.commentText=text;
            };

        $scope.authLoginEvent = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            populateComments();
        });

        if (securityService.loginStatus.isLoggedIn) {
            populateComments();
        }

        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };
    }
]);
