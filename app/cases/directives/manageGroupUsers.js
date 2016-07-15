'use strict';

export default function () {
    return {
        template: require('../views/manageGroupUsers.jade'),
        restrict: 'A',
        controller: 'ManageGroupUsers',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
