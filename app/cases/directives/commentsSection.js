'use strict';
/*jshint unused:vars */
angular.module('RedhatAccess.cases').directive('rhaCasecomments', ['$location','$anchorScroll' ,function ($location, $anchorScroll) {
    return {
        templateUrl: 'cases/views/commentsSection.html',
        controller: 'CommentsSection',
        scope: { loading: '=' },
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', function () {
                element.remove();
            });
            scope.commentReply = function(id,browserIE) {
                var text = '';
                if (browserIE === true) {
                    text = document.getElementById(id + 'text').innerText;
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
                scope.assignCommentsText(text);
            };
        }
    };
}]);
