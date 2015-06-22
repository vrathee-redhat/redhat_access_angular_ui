'use strict';
angular.module('RedhatAccess.cases').directive('rhaListnewattachment', function () {
    return {
        templateUrl: 'ascension/views/listNewAttachments.html',
        restrict: 'A',
        controller: 'ListNewAttachment'
    };
});
