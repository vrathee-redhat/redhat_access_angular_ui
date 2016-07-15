'use strict';

export default function () {
    return {
        template: require('../views/severitySelect.jade'),
        restrict: 'A',
        controller: 'SeveritySelect',
        scope: {
            createdCase: '=',
            severityChange: '&',
            severities: '=',
            severityDisabled: '='
        }
    };
}
