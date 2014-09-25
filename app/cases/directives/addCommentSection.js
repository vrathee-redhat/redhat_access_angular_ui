'use strict';
angular.module('RedhatAccess.cases').directive('rhaAddcommentsection', function () {
    return {
        templateUrl: 'cases/views/addCommentSection.html',
        restrict: 'A',
        controller: 'AddCommentSection',
        link: function (scope, element, attr) {
            scope.maxCharacterCheck = function() {
                element.ready(function() {
                    $('#case-comment-box').attr('maxlength', '32000');
                    var textareaValue = $('#case-comment-box').val();
                    var maxlength = '32000';
                    if (maxlength > textareaValue.length) {
                        var count = textareaValue.length * 100 / maxlength;
                        parseInt(count);
                        $('#commentNotice .progressCount').html( (Math.round(count * 100) / 100) + '%' );
                        $('#commentNotice .progressBar').css({
                            'width' : count + '%'
                        });
                    }
                });
            };
        }
    };
});