'use strict';

export default function () {
    return {
        template: require('../views/manageGroupList.jade'),
        restrict: 'A',
        controller: 'ManageGroupList',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
