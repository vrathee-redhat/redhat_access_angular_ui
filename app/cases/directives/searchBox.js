'use strict';

export default function () {
    return {
        template: require('../views/searchBox.jade'),
        restrict: 'EA',
        controller: 'SearchBox',
        scope: {
            placeholder: '=',
            hidebutton: '=?',
            className: '<'
        }
    };
}
