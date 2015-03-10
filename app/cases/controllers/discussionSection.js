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
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    'EDIT_CASE_CONFIG',
    'CASE_EVENTS',
    function ($scope, $timeout, AttachmentsService, CaseService, DiscussionService, strataService,securityService, $stateParams,$rootScope, AlertService, $modal, $location, $anchorScroll, RHAUtils, EDIT_CASE_CONFIG, CASE_EVENTS) {
        $scope.AttachmentsService = AttachmentsService;
        $scope.CaseService = CaseService;
        $scope.securityService = securityService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.noteCharactersLeft = 255;
        $scope.EDIT_CASE_CONFIG = EDIT_CASE_CONFIG;
        $scope.discussion = true;
        $scope.attachments = false;
        $scope.notes = false;
        $scope.bugzillas = false;

        $scope.DiscussionService = DiscussionService;

        if (CaseService.caseDataReady) {
            $scope.init();
        }
        $scope.$on(CASE_EVENTS.received, function () {
            $scope.init();
        });

        $scope.init = function() {
            DiscussionService.getDiscussionElements(CaseService.kase.case_number).then(angular.bind(this, function (attachmentsJSON) {
                //TODO make more better
                $timeout(function() {
                    CaseService.scrollToComment($location.search().commentId);
                }, 1000);
            }, function (error) {
            }));
        };

        $scope.commentReply = function(comment,browserIE) {
            var person = comment.created_by;
            var originalText = CaseService.commentText;
            var text = comment.text;
            var lines = text.split(/\n/);
            text = '(In reply to ' + person + ')\n';
            for (var i = 0, max = lines.length; i < max; i++) {
                text = text + '> '+ lines[i] + '\n';
            }
            var old = $location.hash();
            var commentsSection = document.getElementById("tab_list");
            if(commentsSection) {
                commentsSection.scrollIntoView(true);
            }
            CaseService.commentText=text;
        };

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

        $scope.maxNotesCharacterCheck = function() {
            if (CaseService.kase.notes !== undefined ) {
               $scope.noteCharactersLeft = 255 - CaseService.kase.notes.length;
            }
        };

        $scope.$watch('AttachmentsService.originalAttachments', function (val) {
            DiscussionService.updateElements();                  
        }, true);
        $scope.$watch('CaseService.comments', function (val) {
            DiscussionService.updateElements();                    
        }, true);
        $scope.$watch('CaseService.kase.notes', function(val) {
            $scope.maxNotesCharacterCheck();
        }, true);

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
        $scope.toggleDiscussion = function(){
            $scope.discussion = true;
            $scope.attachments = false;
            $scope.notes = false;
            $scope.bugzillas = false;
        }
        $scope.toggleAttachments= function(){
            $scope.discussion = false;
            $scope.attachments = true;
            $scope.notes = false;
            $scope.bugzillas = false;
        }
        $scope.toggleNotes = function(){
            $scope.discussion = false;
            $scope.attachments = false;
            $scope.notes = true;
            $scope.bugzillas = false;
        }
        $scope.toggleBugzillas = function(){
            $scope.discussion = false;
            $scope.attachments = false;
            $scope.notes = false;
            $scope.bugzillas = true;
        }

    }
]);
