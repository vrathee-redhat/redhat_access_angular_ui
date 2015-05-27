'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.ascension').controller('CaseDiscussion', [
    '$scope',
    '$timeout',
    'CaseDiscussionService',
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
    '$sce',
    'translate',
    '$filter',
    function ($scope, $timeout, CaseDiscussionService, udsService,securityService, $stateParams, AlertService, $modal, $location, $anchorScroll, RHAUtils, EDIT_CASE_CONFIG, AUTH_EVENTS, CASE_EVENTS, $sce, translate, $filter) {
        this.discussionElements = [];

        $scope.securityService = securityService;
        $scope.udsService = udsService;
        $scope.ie8 = window.ie8;
        $scope.ie9 = window.ie9;
        $scope.EDIT_CASE_CONFIG = EDIT_CASE_CONFIG;

        $scope.commentSortOrder = true;
        $scope.commentSortOrderList = [
            {
                name: translate('Newest Comment Added'),
                sortOrder: 'DESC'
            },
            {
                name: translate('Oldest Comment Added'),
                sortOrder: 'ASC'
            },
        ];

        $scope.CaseDiscussionService = CaseDiscussionService;
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
            var person = comment.createdBy.resource.fullName;
            var lines = truncatedText.split(/\n/);
            truncatedText = '(' + translate('In reply to') + ' ' + person + ')\n';
            for (var i = 0, max = lines.length; i < max; i++) {
                truncatedText = truncatedText + '> ' + lines[i] + '\n';
            }
            var commentsSection = document.getElementById('tab_list');
            if (commentsSection) {
                commentsSection.scrollIntoView(true);
            }
        };
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
