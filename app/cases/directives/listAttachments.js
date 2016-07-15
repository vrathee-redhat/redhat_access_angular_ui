'use strict';

export default function () {
    return {
        template: require('../views/listAttachments.jade'),
        restrict: 'A',
        controller: 'ListAttachments',
        scope: {disabled: '='}
    };
}
