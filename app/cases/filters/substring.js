'use strict';
angular.module('RedhatAccess.cases').filter('substring', function () {
    return function (text, length) {
        var shortText = '';
        if(length === undefined){
            length = 150;
        }
        if (text !== undefined && text.length > length) {
            shortText = text.substr(0, length);
            // var lastSpace = shortText.lastIndexOf(' ');
            // shortText = shortText.substr(0, lastSpace);
            shortText = shortText.concat('...');
        } else {
            shortText = text;
        }
        return shortText;
    };
});