'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').controller('DiscussionSection', [
    '$scope',
    '$timeout',
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
    function ($scope, $timeout, AttachmentsService, CaseService, DiscussionService, strataService,securityService, $stateParams,$rootScope,AUTH_EVENTS, AlertService, $modal, $location, $anchorScroll, RHAUtils) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.progressCount = 0;

        $scope.DiscussionService = DiscussionService;

        $scope.assignCommentsText=function(text) {
            CaseService.commentText=text;
        };

        $scope.authLoginEvent = $rootScope.$on(AUTH_EVENTS.loginSuccess, function () {
            DiscussionService.getDiscussionElements($stateParams.id).then(angular.bind(this, function (attachmentsJSON) {
                //TODO make more better
                $timeout(function() {
                    CaseService.scrollToComment($location.search().commentId);
                }, 1000);
            }, function (error) {
            }));
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

        $scope.$watch('CaseService.kase.notes', function() {
            $scope.maxCharacterCheck();
        });
        $scope.maxCharacterCheck = function() {
            if (CaseService.kase.notes !== undefined ) {
               $scope.progressCount = CaseService.kase.notes.length;
            }
        };

        $scope.updateNotes = function(){
            CaseService.updateCase().then(angular.bind(this, function (attachmentsJSON) {
                this.notesForm.$setPristine();
            }) ,angular.bind(this, function (error) {
                AlertService.addStrataErrorMessage(error);
            }));
        };
        $scope.discardNotes = function(){
            CaseService.kase.notes = CaseService.prestineKase.notes;
            this.notesForm.$setPristine();
        };
    }
]);
