'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('DiscussionSection', [
    '$scope',
    'AttachmentsService',
    'CaseService',
    'DiscussionService',
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
    function ($scope, AttachmentsService, CaseService, DiscussionService, strataService,securityService, $stateParams,$rootScope,AUTH_EVENTS, AlertService, $modal, $location, $anchorScroll, RHAUtils) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;

        $scope.DiscussionService = DiscussionService;

        $scope.assignCommentsText=function(text) {
                CaseService.commentText=text;
            };

        $scope.authLoginEvent = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            DiscussionService.getDiscussionElements($stateParams.id);
        });

        if (securityService.loginStatus.isLoggedIn) {
            DiscussionService.getDiscussionElements($stateParams.id);
        }

        $scope.requestManagementEscalation = function () {
            $modal.open({
                templateUrl: 'cases/views/requestManagementEscalationModal.html',
                controller: 'RequestManagementEscalationModal'
            });
        };

        $scope.deleteAttachment = function(element){
            AttachmentsService.removeOriginalAttachment(element);
        };

        $scope.$watch('AttachmentsService.originalAttachments', function (val) {
            DiscussionService.updateElements();                  
        }, true);
        $scope.$watch('CaseService.comments', function (val) {
            DiscussionService.updateElements();                    
        }, true);
    }
]);
