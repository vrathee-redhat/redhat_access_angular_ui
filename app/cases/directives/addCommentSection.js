'use strict';

export default function () {
    return {
        template: require('../views/addCommentSection.jade'),
        restrict: 'A',
        controller: 'AddCommentSection'
    };
}
