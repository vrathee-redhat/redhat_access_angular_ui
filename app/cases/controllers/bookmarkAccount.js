'use strict';
angular.module('RedhatAccess.cases').controller('BookmarkAccount', [
    '$scope',
    'gettextCatalog',
    'AccountBookmarkService',
    'RHAUtils',
    function ($scope, gettextCatalog, AccountBookmarkService, RHAUtils) {
        $scope.isHovering = false;
        $scope.RHAUtils = RHAUtils;
        $scope.submitting = false;

        $scope.isBookmarked = function () {
            if(RHAUtils.isNotEmpty($scope.account)) {
                return AccountBookmarkService.isBookmarked($scope.account.number);
            }
        };

        $scope.getTooltipText = function () {
            if($scope.isBookmarked()) {
                return gettextCatalog.getString('Remove bookmark!');
            } else {
                return gettextCatalog.getString('Bookmark this account!');
            }
        };

        $scope.mouseOver = function () {
            $scope.isHovering = true;
        };

        $scope.mouseOut = function () {
            $scope.isHovering = false;
        };

        $scope.bookmark = function () {
            var onPromiseComplete = function () {
                $scope.submitting = false;
            };
            $scope.submitting = true;
            if($scope.isBookmarked()) {
                AccountBookmarkService.removeBookmark($scope.account).then(onPromiseComplete, onPromiseComplete);
            }  else {
                AccountBookmarkService.addBookmark($scope.account).then(onPromiseComplete, onPromiseComplete);
            }
        };

    }
]);
