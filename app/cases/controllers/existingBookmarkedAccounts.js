'use strict';

export default class ExistingBookmarkedAccounts {
    constructor($scope, AccountBookmarkService) {
        'ngInject';

        $scope.ABS = AccountBookmarkService;
    }
}
