'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDiscussion', [
    '$scope',
    '$timeout',
    'CaseDetailsService',
    'udsService',
    'securityService', //replace by UDSService
    '$stateParams',
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    'EDIT_CASE_CONFIG',
    'AUTH_EVENTS',
    'CASE_EVENTS',
    'CaseAttachmentsService',
    '$sce',
    'gettextCatalog',
    '$filter',
    'CaseDiscussionService',
    function ($scope, $timeout, CaseDetailsService, udsService,securityService, $stateParams, AlertService, $modal, $location, $anchorScroll, RHAUtils, EDIT_CASE_CONFIG, AUTH_EVENTS, CASE_EVENTS,CaseAttachmentsService, $sce, gettextCatalog, $filter,CaseDiscussionService) {
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.securityService = securityService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.noteCharactersLeft = 255;
        $scope.EDIT_CASE_CONFIG = EDIT_CASE_CONFIG;
        $scope.discussion = true;
        $scope.attachments = false;
        $scope.notes = false;
        $scope.bugzillas = false;
        $scope.hasScrolled = false;
        $scope.commentSortOrder = true;
        $scope.commentSortOrderList = [
            {
                name: gettextCatalog.getString('Newest to Oldest'),
                sortOrder: 'DESC'
            },
            {
                name: gettextCatalog.getString('Oldest to Newest'),
                sortOrder: 'ASC'
            },
        ];

        $scope.CaseDiscussionService = CaseDiscussionService;

        var scroll = function(commentId){
            $timeout(function() {
                if(!$scope.hasScrolled && angular.element(commentId)){
                    CaseDetailsService.scrollToComment(commentId);
                }
                else{
                    scroll(commentId);
                }
            }, 150);
        };

        $scope.init = function() {

        };

        if (securityService.loginStatus.isLoggedIn) {
            $scope.init();
        }
        $scope.authLoginEvent = $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $scope.init();
        });

        $scope.commentReply = function(comment,browserIE) {
            var truncatedText=comment.text.substring(0,1000);
            var person = comment.created_by;
            var lines = truncatedText.split(/\n/);
            truncatedText = gettextCatalog.getString('(In reply to {{personName}})',{personName:person}) +'\n';
            for (var i = 0, max = lines.length; i < max; i++) {
                truncatedText = truncatedText + '> ' + lines[i] + '\n';
            }
            var commentsSection = document.getElementById('tab_list');
            if (commentsSection) {
                commentsSection.scrollIntoView(true);
            }
            CaseDetailsService.commentText = truncatedText;
        };

        if (securityService.loginStatus.isLoggedIn) {
            CaseDiscussionService.getDiscussionElements($stateParams.id);
        }



        $scope.deleteAttachment = function(element){
            CaseAttachmentsService.removeOriginalAttachment(element);
        };


        $scope.$watch('CaseAttachmentsService.originalAttachments', function (val) {
            CaseDiscussionService.updateElements();
        }, true);


        $scope.$watch('CaseDetailsService.comments', function (val) {
            CaseDiscussionService.updateElements();
        }, true);




        $scope.$on('$locationChangeSuccess', function(event){
            var splitUrl = $location.path().split('/');
            if(splitUrl[2] !== undefined && $location.path().search(/case\/[0-9]{1,8}/i) !== -1){
                var newCaseId = splitUrl[2];
                var oldCaseId = $scope.CaseDetailsService.kase.case_number;
                if(newCaseId !== oldCaseId){
                    $stateParams.id = newCaseId;
                    CaseDetailsService.clearCase();
                    $scope.init();
                }
            }
        });

        $scope.$on(CASE_EVENTS.received, function () {
            if (CaseDetailsService.kase.chats !== undefined && CaseDetailsService.kase.chats.chat !== undefined) {
                angular.forEach(CaseDetailsService.kase.chats.chat, angular.bind(this, function (chat) {
                    chat.last_modified_date = chat.start_date;
                    chat.last_modified_time = chat.start_time;
                    chat.comment_type = 'chat';
                    CaseDiscussionService.chatTranscriptList.push(chat);
                }));
            } else {
                CaseDiscussionService.chatTranscriptList = [];
            }
            CaseDiscussionService.updateElements();
        });

        $scope.parseCommentHtml = function (comment) {
            var parsedHtml = '';
            if (comment.body !== undefined) {
                if (RHAUtils.isNotEmpty(comment.body)) {
                    var rawHtml = comment.body.toString();
                    parsedHtml = $sce.trustAsHtml(rawHtml);
                }
            } else if (comment.text !== undefined) {
                if (RHAUtils.isNotEmpty(comment.text)) {
                    parsedHtml = $filter('linky')(comment.text,'_blank');
                }
            }
            return parsedHtml;
        };

        $scope.onSortOrderChange = function () {
            if (RHAUtils.isNotEmpty(CaseDiscussionService.commentSortOrder)) {
                if (CaseDiscussionService.commentSortOrder.sortOrder === 'ASC') {
                    $scope.commentSortOrder = false;
                } else if (CaseDiscussionService.commentSortOrder.sortOrder === 'DESC') {
                    $scope.commentSortOrder = true;
                }
            }
        };

    }
]);
