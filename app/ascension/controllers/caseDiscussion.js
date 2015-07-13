'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDiscussion', [
    '$scope',
    '$timeout',
    'CaseDetailsService',
    'udsService',
    'securityService',
    '$stateParams',
    'AlertService',
    '$modal',
    '$location',
    '$anchorScroll',
    'RHAUtils',
    'EDIT_CASE_CONFIG',
    'AUTH_EVENTS',
    'TOPCASES_EVENTS',
    'CaseAttachmentsService',
    '$sce',
    'gettextCatalog',
    '$filter',
    'CaseDiscussionService',
    function ($scope, $timeout, CaseDetailsService, udsService,securityService, $stateParams, AlertService, $modal, $location, $anchorScroll, RHAUtils, EDIT_CASE_CONFIG, AUTH_EVENTS, TOPCASES_EVENTS,CaseAttachmentsService, $sce, gettextCatalog, $filter,CaseDiscussionService) {
        $scope.CaseAttachmentsService = CaseAttachmentsService;
        $scope.CaseDetailsService = CaseDetailsService;
        $scope.securityService = securityService;
        $scope.CaseDiscussionService = CaseDiscussionService;
        $scope.discussionElements = new Array();
        $scope.discussionElements = CaseDiscussionService.discussionElements;

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
            }
        ];

        $scope.commentFilterList = [
            {
                name: gettextCatalog.getString('View All'),
                filter: 'all'
            },
            {
                name: gettextCatalog.getString('View Messages'),
                filter: 'comments'
            },
            {
                name: gettextCatalog.getString('View Notes'),
                filter: 'internalComments'
            },
            {
                name: gettextCatalog.getString('View Attachments'),
                filter: 'all'
            },
            {
                name: gettextCatalog.getString('View Bugzillas'),
                filter: 'bugzillas'
            },
            {
                name: gettextCatalog.getString('View Chat Transcripts'),
                filter: 'bugzillas'
            },
            {
                name: gettextCatalog.getString('View Bomgar Sessions'),
                filter: 'bomgar'
            }
        ];
        $scope.commentFilter = $scope.commentFilterList[0];



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

        $scope.commentReply = function(comment) {
            var truncatedText=comment.text.substring(0,1000);
            var person = comment.createdBy.resource.fullName;
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


        $scope.$watch('CaseAttachmentsService', function (val) {
            $scope.onFilterChange();
        }, true);


        $scope.$watch('CaseDetailsService', function (val) {
            $scope.onFilterChange();
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

        $scope.$on(TOPCASES_EVENTS.caseDetailsFetched, function () {
            if (CaseDetailsService.kase.chats !== undefined && CaseDetailsService.kase.chats.chat !== undefined) {
                angular.forEach(CaseDetailsService.kase.chats.chat, angular.bind(this, function (chat) {
                    chat.last_modified_date = chat.start_date;
                    chat.last_modified_time = chat.start_time;
                    chat.comment_type = 'chat';
                    CaseDiscussionService.liveChatTranscripts.push(chat);
                }));
            } else {
                CaseDiscussionService.liveChatTranscripts = [];
            }
            CaseDiscussionService.updateElements();
        });

        $scope.parseCommentHtml = function (comment) {
            var parsedHtml = '';
            if(comment.resource) {
                    if (RHAUtils.isNotEmpty(comment.resource.body)) {
                        var rawHtml = comment.resource.body.toString();
                        parsedHtml = $sce.trustAsHtml(rawHtml);
                    }
                    else
                    {
                      if (RHAUtils.isNotEmpty(comment.resource.text)) {
                        parsedHtml = $filter('linky')(comment.resource.text, '_blank');
                      }
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

        $scope.onFilterChange = function () {
            if (RHAUtils.isNotEmpty($scope.commentFilter)){
                if ($scope.commentFilter === $scope.commentFilterList[0]) {
                    $scope.discussionElements = CaseDiscussionService.discussionElements;
                } else if ($scope.commentFilter === $scope.commentFilterList[1]) {
                    $scope.discussionElements = CaseDiscussionService.publicComments;
                } else if ($scope.commentFilter === $scope.commentFilterList[2]) {
                    $scope.discussionElements = CaseDiscussionService.privateComments;
                } else if ($scope.commentFilter === $scope.commentFilterList[3]) {
                    $scope.discussionElements = CaseDiscussionService.attachments;
                } else if ($scope.commentFilter === $scope.commentFilterList[4]) {
                    $scope.discussionElements = CaseDiscussionService.bugzillas;
                } else if ($scope.commentFilter === $scope.commentFilterList[5]) {
                    $scope.discussionElements = CaseDiscussionService.liveChatTranscripts;
                } else if ($scope.commentFilter === $scope.commentFilterList[6]) {
                    $scope.discussionElements = [];
                }
            }
        };

    }
]);
