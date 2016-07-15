'use strict';

export default function () {
    return {
        template: require('../views/listBugzillas.jade'),
        restrict: 'A',
        controller: 'ListBugzillas',
        scope: {loading: '='},
        link: function postLink(scope, element, attrs) {}
    };
}
