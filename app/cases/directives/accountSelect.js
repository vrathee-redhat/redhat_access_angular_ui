'use strict';

export default function () {
    return {
        template: require('../views/accountSelect.jade'),
        restrict: 'A',
        controller: 'AccountSelect'
    };
}
