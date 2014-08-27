'use strict';
/*jshint unused:vars */
/*jshint camelcase: false */
angular.module('RedhatAccess.cases').service('GroupService', [
    'strataService',
    function (strataService) {
        this.reloadTable = {};
        this.groupsOnScreen = [];
    }
]);
