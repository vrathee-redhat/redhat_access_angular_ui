'use strict';

export default function () {
    return {
        template: require('../views/attachmentsSection.jade'),
        restrict: 'A',
        controller: 'AttachmentsSection',
        scope: {loading: '='},
        link: function postLink(scope, element, attrs) {
        }
    };
}
