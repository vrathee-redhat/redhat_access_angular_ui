'use strict';

export default function() {
    return {
        template: require('../views/createGroupButton.jade'),
        restrict: 'A',
        controller: 'CreateGroupButton'
    };
}
