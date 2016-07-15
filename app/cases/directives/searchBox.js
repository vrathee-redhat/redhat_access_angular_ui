'use strict';

export default function () {
    return {
        template: require('../views/searchBox.jade'),
        restrict: 'A',
        controller: 'SearchBox',
        scope: {
            placeholder: '=',
            hidebutton: '=?'
        }
    };
}
