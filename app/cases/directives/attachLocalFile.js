'use strict';

export default function () {
    return {
        template: require('../views/attachLocalFile.jade'),
        restrict: 'A',
        controller: 'AttachLocalFile',
        scope: {disabled: '='}
    };
}
