'use strict';

export default () => {
    return {
        template: require('../views/logsInstructionPane.jade'),
        restrict: 'A',
        link: function postLink(scope, element, attrs) {}
    };
}
