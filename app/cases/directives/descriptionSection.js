'use strict';

export default function () {
    return {
        template: require('../views/descriptionSection.jade'),
        restrict: 'A',
        scope: {loading: '='},
        controller: 'DescriptionSection',
        link: function postLink(scope, element, attrs) {
        }
    };
}
