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

        $scope.commentReply = function(id,browserIE) {
            var text = '';
            if (browserIE === true) {
                text = $('#'+id+' .browserIE').text();
            } else {
                text = $('#'+id+' .browserNotIE').text();
            }
            var person = $('#'+id+' .personNameBlock').text();
            var originalText = $('#case-comment-box').val();
            var lines = text.split(/\n/);
            text = '(In reply to ' + person + ')\n';
            for (var i = 0, max = lines.length; i < max; i++) {
                text = text + '> '+ lines[i] + '\n';
            }
            if (originalText.trim() !== '') {
                text = '\n' + text;
            }
            $('#case-comment-box').val($('#case-comment-box').val()+text).keyup();

            //Copying the code from the link to comment method
            var old = $location.hash();
            $location.hash('case-comment-box');
            $anchorScroll();
            $location.hash(old);
            $location.search('commentBox', 'commentBox');
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
