'use strict';
angular.module('RedhatAccess.cases').directive('rhaExistingBookmarkedAccounts',function () {
    return {
        templateUrl: 'cases/views/existingBookmarkedAccounts.html',
        controller: 'ExistingBookmarkedAccounts',
        restrict: 'A',
        scope: {}
    };
});
