'use strict';
angular.module('RedhatAccess.cases').filter('IE8preFix', function () {
    return function (text) {
        text = '<pre>' + text + '</pre>'
        return text;
    };
});