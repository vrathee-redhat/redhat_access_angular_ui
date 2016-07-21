'use strict';

export default function () {
    return {
        template: require('../views/deleteGroupButton.jade'),
        restrict: 'A',
        controller: 'DeleteGroupButton'
    };
}
