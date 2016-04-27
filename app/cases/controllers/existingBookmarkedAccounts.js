'use strict';
angular.module('RedhatAccess.cases').controller('ExistingBookmarkedAccounts', [
   '$scope',
    'securityService',
    'AUTH_EVENTS',
    'AccountBookmarkService',
    'RHAUtils',
    'ACCOUNT_EVENTS',
    function ($scope, securityService, AUTH_EVENTS,AccountBookmarkService, RHAUtils, ACCOUNT_EVENTS) {
        $scope.ABS = AccountBookmarkService;
    }
]);
