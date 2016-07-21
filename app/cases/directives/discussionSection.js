'use strict';

export default function () {
    return {
        template: require('../views/discussionSection.jade'),
        controller: 'DiscussionSection',
        scope: {loading: '='},
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
            scope.$on('$destroy', () => element.remove() );
        }
    };
}
