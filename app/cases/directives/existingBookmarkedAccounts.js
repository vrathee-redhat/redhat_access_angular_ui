'use strict';

export default function () {
    return {
        template: require('../views/existingBookmarkedAccounts.jade'),
        controller: 'ExistingBookmarkedAccounts',
        restrict: 'A',
        scope: {}
    };
}
