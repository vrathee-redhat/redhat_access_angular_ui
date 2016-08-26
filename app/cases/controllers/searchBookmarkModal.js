"use strict";

import find from 'lodash/find'

export default class SearchBookmarkModal {
    constructor($scope, $uibModalInstance, query, sort, bookmark, RHAUtils, SearchBookmarkService) {
        "ngInject";

        const idRegex = /^[a-z0-9-\(\)]+$/;
        const idReplaceRegex = /[^a-z0-9-\(\)]+/g;

        $scope.query = query;
        $scope.sort = sort;
        $scope.creating = bookmark == null;
        $scope.bookmark = bookmark || {};
        $scope.originalId = bookmark != null ? bookmark.id : null;

        $scope.cancel = () => $uibModalInstance.dismiss();

        $scope.bookmarkValid = () => RHAUtils.isNotEmpty($scope.bookmark.name) && idRegex.test($scope.bookmark.id) && $scope.nameValid && $scope.idValid;
        $scope.createID = (name) => (name || '').toLowerCase().trim().replace(/\s+/g, '-').replace(idReplaceRegex, '');

        $scope.save = () => {
            if($scope.bookmarkValid()) {
                $scope.bookmark.query = $scope.query;
                $scope.bookmark.sort = $scope.sort;
                if($scope.originalId) {
                    SearchBookmarkService.deleteBookmark($scope.originalId);
                }
                SearchBookmarkService.saveBookmark($scope.bookmark);
                $uibModalInstance.close($scope.bookmark);
            }
        };

        $scope.verifyName = (name) => {
            if(RHAUtils.isEmpty(name)) return false;

            const foundBookmark = find(SearchBookmarkService.getAllBookmarks(), {name: name});

            return foundBookmark == null || foundBookmark.id == $scope.originalId;
        };

        $scope.verifyId = (id) => {
            if(RHAUtils.isEmpty(id)) return false;

            const foundBookmark = SearchBookmarkService.getBookmark(id);

            return foundBookmark == null || foundBookmark.id == $scope.originalId;
        };

        $scope.$watch('bookmark.id', (newValue, oldValue) => {
            if(RHAUtils.isNotEmpty(newValue) && !idRegex.test(newValue)) {
                // Try to replace all invalid characters
                const id = newValue.toLowerCase().replace(/\s+/g, '-');
                if(idRegex.test(id)) {
                    $scope.bookmark.id = id;
                } else { // Unable to fix all bad characters, reset to previous
                    $scope.bookmark.id = oldValue;
                }

            }

            $scope.idValid = $scope.verifyId(newValue);
        });

        $scope.$watch('bookmark.name', (newValue, oldValue) => {
            if(!$scope.originalId && (RHAUtils.isEmpty($scope.bookmark.id) || $scope.createID(oldValue) == $scope.bookmark.id)) {
                //if User didn't modify the ID, let's continue generating it
                $scope.bookmark.id = $scope.createID(newValue);
            }

            $scope.nameValid = $scope.verifyName(newValue);
        });
    }
}
