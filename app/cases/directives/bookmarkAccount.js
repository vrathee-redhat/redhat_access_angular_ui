'use strict';

export default function () {
    return {
        template: require('../views/bookmarkAccount.jade'),
        controller: 'BookmarkAccount',
        restrict: 'A',
        scope: {
            account: '='
        }
    }
}
