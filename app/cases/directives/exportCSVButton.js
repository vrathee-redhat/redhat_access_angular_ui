'use strict';

export default function () {
    return {
        template: require('../views/exportCSVButton.jade'),
        restrict: 'A',
        controller: 'ExportCSVButton'
    };
}
