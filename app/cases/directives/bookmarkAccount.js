'use strict';
angular.module('RedhatAccess.cases').directive('rhaBookmarkAccount', function () {
    return {
        templateUrl: 'cases/views/bookmarkAccount.html',
        controller: 'BookmarkAccount',
        restrict: 'A',
        scope: {
            account: '='
        }
    }
});
