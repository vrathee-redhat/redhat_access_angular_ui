'use strict';

export default function () {
    return {
        template: require('../views/groupList.jade'),
        restrict: 'A',
        controller: 'GroupList',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
