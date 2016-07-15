'use strict';

export default () => {
    return {
        template: require('../views/logTabs.jade'),
        restrict: 'A',
        link: function postLink(scope, element, attrs) {
        }
    };
}
