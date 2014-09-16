'use strict';
angular.module('RedhatAccess.cases').filter('ie8ifyNewlines', function () {
    return function (text) {
        text.replace(/\n/g, '\r\n');
        return text;
    };
});