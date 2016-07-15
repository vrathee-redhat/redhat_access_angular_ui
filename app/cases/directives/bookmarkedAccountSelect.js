'use strict';

export default function () {
    return {
        template: require('../views/bookmarkedAccountSelect.jade'),
        controller: 'BookmarkedAccountSelect',
        restrict: 'A',
        scope: {
            selectedAccount: '=',
            selectedAccountChanged: '&'
        }
    };
}
