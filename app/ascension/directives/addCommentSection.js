'use strict';
angular.module('RedhatAccess.ascension').directive('rhaAddcomments', function () {
    return {
        templateUrl: 'ascension/views/addCommentSection.html',
        restrict: 'A',
        controller: 'AddComments'
    };
});
