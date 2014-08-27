'use strict';
angular.module('RedhatAccess.logViewer').service('accordian', function () {
    var groups = [];
    return {
        getGroups: function () {
            return groups;
        },
        addGroup: function (group) {
            groups.push(group);
        },
        clearGroups: function () {
            groups = '';
        }
    };
});