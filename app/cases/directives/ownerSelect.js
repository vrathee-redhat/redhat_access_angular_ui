'use strict';

export default function () {
    return {
        template: require('../views/ownerSelect.jade'),
        restrict: 'A',
        controller: 'OwnerSelect',
        scope: {onchange: '&'},
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
