'use strict';

export default function () {
    return {
        template: require('../views/listNewAttachments.jade'),
        restrict: 'A',
        controller: 'ListNewAttachments'
    };
}
